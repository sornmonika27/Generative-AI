import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { CardInfo } from '../entity/card-info.entity';
import { TokenizePayment } from '../entity/tokenize.payment.entity';
import { UserInfo } from '../entity/user.entity';
import { UserTransaction } from '../entity/user-transaction.entity';
import { CustomError } from '../utils/custom-error';
import { CustomResponse } from '../utils/custom-response';
import { base64String } from '../utils/base64';
import { generateHMACSHA512 } from '../utils/hash-util';
import { generateToken } from '../utils/encrypt';
import { maskVisaNumber } from '../utils/card-number-generator';
import { convertStringToTimestamp, formatDate, validateEmail, validateTimestamp } from '../utils/validation';
import { transcode } from 'buffer';
import Big from "big.js"
import { payload } from '../common';
// Define enums and interfaces for better type safety
enum PaymentOption {
  CARD = 'CARD',
  LINK = 'LINK',
}

enum PaymentType {
  PURCHASE = "PURCHASE",
  PRE_AUTH = "PRE-AUTH",
  CAPTURE = "CAPTURE",
  RELEASE = "RELEASE"
}

interface PaymentData {
  req_time: string;
  merchant_code: string;
  tran_id: string;
  amount: string;
  currency: string;
  user_name: string;
  last_name: string;
  user_email: string;
  user_contact: string;
  hash: string;
  backend_url: string;
  continue_success_url: string;
  payment_option: string;
  card_number?: string;
  exp_date?: string;
  cvv?: string;
  ctid?: string;
  pwt?: string;
  save_card?: string;
  type?: string
}

export class CreatePayment {
  private userTranRepo: Repository<UserTransaction>;
  private userRepo: Repository<UserInfo>;
  private userCard: Repository<CardInfo>;
  private userTokenize: Repository<TokenizePayment>;

  constructor(
    userTranRepo: Repository<UserTransaction>,
    userRepo: Repository<UserInfo>,
    userCard: Repository<CardInfo>,
    userTokenize: Repository<TokenizePayment>,
  ) {
    this.userTranRepo = userTranRepo;
    this.userRepo = userRepo;
    this.userCard = userCard;
    this.userTokenize = userTokenize;
  }

  async paymentProcessing(data: PaymentData, publicKey: string): Promise<CustomResponse> {
    // Validate the initial payment data
    this.validatePaymentData(data, publicKey);

    const paymentOption = data.payment_option.toUpperCase() as PaymentOption;
    const floatAmount = parseFloat(data.amount);
    const backEndURL = base64String(data.backend_url);

    // Check for duplicate transaction
    const existingTransaction = await this.userTranRepo.findOne({ where: { tranId: data.tran_id } });
    if (existingTransaction) {
      if (existingTransaction.status == "COMPLETED" || existingTransaction.status == data.type)
        throw new CustomError('Duplicate transaction ID!', 400);
    }


    // Process payment based on the payment option
    switch (paymentOption) {
      case PaymentOption.CARD:
        // Retrieve the user along with their cards
        const cardInfo = await this.userCard.findOne({
          where: {
            cardNumber: data.card_number
          },
          relations: ["user"]
        })

        if (!cardInfo) throw new CustomError('Card not found!', 404);
        return await this.processCardPayment(data, cardInfo, floatAmount, backEndURL);
      case PaymentOption.LINK:
        return await this.processLinkPayment(data, floatAmount, backEndURL);
      default:
        throw new CustomError('Invalid payment option!', 400);
    }
  }

  private validatePaymentData(data: PaymentData, publicKey: string): void {
    const {
      req_time,
      merchant_code,
      tran_id,
      amount,
      currency,
      user_email,
      hash,
      backend_url,
      continue_success_url,
      payment_option,
      ctid,
      pwt,
      user_name,
      last_name,
      user_contact,
      type
    } = data;

    const backEndURL = base64String(backend_url);
    const stringToHash =
      req_time +
      merchant_code +
      tran_id +
      amount +
      (ctid || '') +
      (pwt || '') +
      user_name +
      last_name +
      user_email +
      user_contact +
      type +
      payment_option +
      backEndURL +
      (continue_success_url || "") +
      currency;

    const hmacHash = generateHMACSHA512(stringToHash, publicKey);

    if (hash !== hmacHash) throw new CustomError('Invalid Hash', 400);
    if (!validateTimestamp(req_time)) throw new CustomError('Invalid timestamp!', 400);
    if (merchant_code !== 'buywiz') throw new CustomError('Invalid merchant code', 400);

    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount) || floatAmount <= 0 || floatAmount >= 10000)
      throw new CustomError('Invalid amount!', 400);
    if (currency.toUpperCase() !== 'USD') throw new CustomError('Invalid currency!', 400);

    const paymentOpt = payment_option.toUpperCase();
    if (!Object.values(PaymentOption).includes(paymentOpt as PaymentOption))
      throw new CustomError('Invalid payment option!', 400);

    if (paymentOpt === PaymentOption.LINK && !validateEmail(user_email)) {
      throw new CustomError('Invalid email!', 400);
    }
  }

  private async processCardPayment(
    data: PaymentData,
    card: CardInfo,
    amount: number,
    backEndURL: string,
  ): Promise<CustomResponse> {
    const { cvv, card_number, exp_date, save_card, continue_success_url, tran_id, req_time, currency, type } = data;

    // Validate required card details
    if (!cvv || !card_number || !exp_date) {
      throw new CustomError('Card details are required for CARD payment option.', 400);
    }

    const cardInfo = card

    if (cardInfo.amount < amount) throw new CustomError('Insufficient balance!', 400);

    if (
      cardInfo.cvv !== Number(cvv) ||
      cardInfo.cardNumber !== card_number ||
      cardInfo.expirationDate !== exp_date
    ) {
      throw new CustomError('Invalid card information!', 400);
    }

    console.log(cardInfo.cvv, cardInfo.cardNumber, cardInfo.expirationDate)

    await this.updateCardInfoAndSaveTran(card, card.user.userId, tran_id, req_time, amount, currency, cardInfo, type ?? "")
    await this.paymentStatusCallbackToVendor(tran_id, '000011', 0, backEndURL);

    if (save_card == "on") {
      const ctidToken = generateToken({ id: card.user.userId, email: card.user.userEmail });
      const pwtToken = generateToken({
        id: card.user.userId,
        email: card.user.userEmail,
        cardId: cardInfo.cardId,
      });
      const maskedNumber = maskVisaNumber(cardInfo.cardNumber);

      await this.saveCardCallbackToVendor(tran_id, 0, ctidToken, pwtToken, maskedNumber, backEndURL);
    }

    

    return new CustomResponse(200, 'Payment success!', null, null, `${continue_success_url}?tran_id=${tran_id}&date=${encodeURIComponent(formatDate(new Date()))}&amount=$${amount}`);
  }

  private async processLinkPayment(
    data: PaymentData,
    amount: number,
    backEndURL: string,
  ): Promise<CustomResponse> {
    const { ctid, pwt, tran_id, req_time, currency, continue_success_url, type } = data;

    // Validate required tokens
    if (!ctid || !pwt) throw new CustomError('Tokens ctid and pwt are required for LINK payment option.', 400);

    try {
      const reqCtid = jwt.verify(ctid, process.env.JWT_SECRET ?? '');
      const reqPwt = jwt.verify(pwt, process.env.JWT_SECRET ?? '') as payload;

      if (!reqCtid || !reqPwt) throw new Error();

      const cardInfo = await this.userCard.findOne({
        where: {
          cardId: reqPwt.cardId
        },
        relations: ["user"]
      })

      if(!cardInfo) throw new CustomError("Card not found?", 404)

      if (cardInfo  && cardInfo.amount < amount) throw new CustomError('Insufficient balance!', 400);

      await this.updateCardInfoAndSaveTran(cardInfo, reqPwt.id, tran_id, req_time, amount, currency, cardInfo, type ?? "")
      await this.paymentStatusCallbackToVendor(tran_id, '000011', 0, backEndURL);
      console.log("Date time", convertStringToTimestamp(req_time))

      return new CustomResponse(200, 'Payment success!', null, null, `${continue_success_url}?tran_id=${tran_id}&date=${encodeURIComponent(formatDate(new Date()))}&amount=$${amount}`);
    } catch (error) {
      throw new CustomError('Invalid token!', 400);
    }
  }

  private async updateCardInfoAndSaveTran(
    card: CardInfo,
    userId: string,
    tranId: string,
    reqTime: string,
    amount: number,
    currency: string,
    cardInfo: CardInfo,
    paymentType: string,
  ) {
    let paymentStatus = ""
    let deductAmount = 0
    switch (paymentType?.toUpperCase()) {
      case PaymentType.PRE_AUTH:
        paymentStatus = PaymentType.PRE_AUTH
        deductAmount = card.amount - amount
        break
      case PaymentType.CAPTURE:
        paymentStatus = "COMPLETED"
        break
      case PaymentType.RELEASE:
        const tranInfo = await this.userTranRepo.createQueryBuilder("transaction")
          .where('transaction.tranId = :id', { id: tranId })
          .getOne();
        console.log("Current amount ", card.amount)
        console.log("Tran amount ", tranInfo?.amount)
        deductAmount = Big(card.amount).plus((tranInfo?.amount ?? 0)).toNumber()
        console.log("Deduct ", deductAmount)
        paymentStatus = PaymentType.RELEASE
        break
      default:
        paymentStatus = "COMPLETED"
        deductAmount = card.amount - amount

    }

    // Proceed with transaction
    const tranInfo = new UserTransaction();
    if (paymentType?.toUpperCase() != PaymentType.CAPTURE || paymentType?.toUpperCase() != PaymentType.RELEASE) {
      console.log("-- save tran", tranId)
      tranInfo.tranId = tranId;
      tranInfo.reqTime = reqTime;
      tranInfo.amount = amount
      tranInfo.currency = currency;
      tranInfo.card = cardInfo;
      tranInfo.status = paymentStatus
      await this.userTranRepo.save(tranInfo);
    } else {
      console.log("-- update tran", tranId)
      await this.userTranRepo.createQueryBuilder()
        .update(UserTransaction)
        .set({ status: paymentStatus })
        .where("tranId = :id", { id: tranId })
        .execute();
    }


    if (paymentType?.toUpperCase() != PaymentType.CAPTURE) {
      await this.userCard.createQueryBuilder()
        .update(CardInfo)
        .set({ amount: deductAmount })
        .where("userId = :id", { id: userId })
        .execute();
    }

  }

  private async paymentStatusCallbackToVendor(
    tranId: string,
    apv: string,
    status: number,
    backUrl: string,
  ): Promise<void> {
    try {
      await axios.post(backUrl, {
        tran_id: tranId,
        apv,
        status,
      });
    } catch (error) {
      // Handle the error appropriately (e.g., logging)
      // console.error('Failed to send payment status callback:', error);
    }
  }

  private async saveCardCallbackToVendor(
    tranId: string,
    status: number,
    ctid: string,
    pwt: string,
    maskAccount: string,
    backEnd: string,
  ): Promise<void> {
    try {
      await axios.post(backEnd, {
        tran_id: tranId,
        status,
        ctid,
        card_status: {
          status: '00',
          pwt,
          mask_account: maskAccount,
        },
      });
    } catch (error) {
      // Handle the error appropriately (e.g., logging)
      console.error('Failed to send save card callback:', error);
    }
  }
}
