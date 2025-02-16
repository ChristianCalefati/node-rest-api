const crypto = require('crypto');
const util = require('util');
const hashPasswordFunction = util.promisify(crypto.pbkdf2);

export function isNumber(input: string): RegExpMatchArray | boolean {
    return input?.match(/^\d+$/) ?? false;
}

export async function calculatePasswordHash(password: string, passwordSalt: string) {
    const hash = await hashPasswordFunction(password, passwordSalt, 1000, 64, 'sha512');
    return hash.toString('hex');

}