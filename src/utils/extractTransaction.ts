type TransactionData = {
    apv?: string
    purchase?: string 
    amount?: string
    fromAccount?: string 
    trxId?: string
    seller?: string
    transactionDate?: string
}


export const extractTransactionData = (text: string) => {
    const regex = {
        apv: /APV:\s*(\d+)/,
        purchase: /Purchase #:\s*(\d+)/,
        amount: /Original amount:\s*([\d.]+)\s*USD/,
        fromAccount: /From account:\s*([\w]+)/,
        trxId: /Trx\. ID:\s*(\d+)/,
        seller: /Seller:\s*([A-Za-z0-9\s.]+)/,
        transactionDate: /Transaction date:\s*([A-Za-z]+ \d{1,2}, \d{4} \d{1,2}:\d{2} [APM]+)/
    };

    const result: any = {};
    
    for (const [key, pattern] of Object.entries(regex)) {
        const match = text.match(pattern);
        result[key] = match ? match[1] : null;
    }

    return result as TransactionData;
}