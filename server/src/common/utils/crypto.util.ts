import { generateKeyPairSync, randomInt } from 'crypto';

export class CryptoUtil {
  static randomNumber(length = 7): number {
    const min = 10 ** (length - 1);
    const max = 10 ** length;
    return randomInt(min, max);
  }

  static generateKeyPair() {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    return { publicKey, privateKey };
  }
}
