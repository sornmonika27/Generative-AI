export function generateHMACSHA512(message: string, secret: string) {
    var crypto = require('crypto-js');
    var hash = crypto.HmacSHA512(message, secret);
    return crypto.enc.Base64.stringify(hash);
}