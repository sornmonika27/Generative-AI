// Function to generate a random number between min and max
const randomDigit = (): number => Math.floor(Math.random() * 10);

// Function to generate a credit card number (16 digits)
export const generateCreditCardNumber = (): string => {
  // Step 1: Generate the first 15 digits randomly
  const creditCardDigits: number[] = [];
  for (let i = 0; i < 15; i++) {
    creditCardDigits.push(randomDigit());
  }

  // Step 2: Calculate the Luhn check digit (16th digit)
  const checkDigit = calculateLuhnCheckDigit(creditCardDigits);

  // Step 3: Append the check digit to form the complete card number
  creditCardDigits.push(checkDigit);

  // Return the number as a string
  return creditCardDigits.join('');
};

// Function to calculate the Luhn check digit
const calculateLuhnCheckDigit = (digits: number[]): number => {
  let sum = 0;
  let shouldDouble = true;

  // Traverse the digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    // Double every second digit
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble; // Toggle the double state
  }

  // Calculate the check digit to make the total sum a multiple of 10
  return (10 - (sum % 10)) % 10;
};


// Function to generate a random CVV (3 or 4 digits)
export const generateCVV = (length: number = 3): string => {
    let cvv = '';
    for (let i = 0; i < length; i++) {
      cvv += Math.floor(Math.random() * 10); // Random digit from 0 to 9
    }
    return cvv;
  };
  
// Function to generate an expiration date for 1 year from now
export const generateExpirationDate = (): string => {
    const currentDate = new Date();
  
    // Add 1 year to the current year
    const expirationYear = currentDate.getFullYear() + 1;
    
    // Get the current month (Months are 0-indexed, so we add 1 to get a 1-based month)
    const expirationMonth = currentDate.getMonth() + 1;
  
    // Format the expiration date as MM/YY (ensure month is 2 digits)
    const formattedMonth = expirationMonth < 10 ? `0${expirationMonth}` : `${expirationMonth}`;
    const formattedYear = expirationYear.toString().slice(-2); // Get the last 2 digits of the year
  
    return `${formattedMonth}/${formattedYear}`;
  };
  

  
  

export function maskVisaNumber(cardNumber: string): string {
  // Ensure the input is a string and at least 4 characters long
  if (cardNumber.length < 4) {
    throw new Error('Card number is too short');
  }

  // Keep the last 4 digits and replace the rest with asterisks
  const maskedCardNumber = cardNumber.slice(0, -4).replace(/\d/g, "*") + cardNumber.slice(-4);
  
  return maskedCardNumber;
}