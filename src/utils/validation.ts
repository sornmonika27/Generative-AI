export function validateEmail(email: string): boolean {
    const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegEx.test(email);
  }
  

  export function getTimestamp(): string {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  export function validateTimestamp(timestamp: string) {
    // Regular expression to validate format (YYYYMMDDHHMMSS)
    const regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])([0-5]\d)([0-5]\d)$/;
  
    if (!regex.test(timestamp)) {
      return false; // If format is incorrect, return false
    }
  
    // Extract date and time parts
    const year = parseInt(timestamp.substring(0, 4), 10);
    const month = parseInt(timestamp.substring(4, 6), 10);
    const day = parseInt(timestamp.substring(6, 8), 10);
    const hours = parseInt(timestamp.substring(8, 10), 10);
    const minutes = parseInt(timestamp.substring(10, 12), 10);
    const seconds = parseInt(timestamp.substring(12, 14), 10);
  
    // Check if the date is valid (accounting for leap years)
    const date = new Date(year, month - 1, day); // Month is 0-based in JS Date
  
    // Validate if the day is correct for the given month and year
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      return false;
    }
  
    // If the timestamp is valid
    return true;
  }

  export function convertStringToTimestamp(dateString: string): string {
    // Parse the string into a Date object
    const parsedDate = new Date(dateString.replace(' ', 'T')); // Convert to ISO format
  
    // Call the existing function to convert Date to YYYYMMDDHHMMSS format
    return convertDateToTimestamp(parsedDate);
  }
  
  export function convertDateToTimestamp(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  export function formatDate(date: Date): string {
    const months = [
        "January", "February", "March", "April", "May", "June", "July", 
        "August", "September", "October", "November", "December"
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    return `${month} ${day}, ${year} ${hours}:${minutes} ${period}`;
}