import * as jwt from 'jsonwebtoken';
import ms from 'ms';

export class JwtUtil {
  static signAccessToken(
    payload: object,
    secret: string,
    algorithm = 'HS256',
    expiresIn = '15m',
  ) {
    const option: jwt.SignOptions = {
      algorithm: algorithm as jwt.Algorithm,
      expiresIn: expiresIn as ms.StringValue,
    };
    return jwt.sign(payload, secret, option);
  }

  static verifyAccessToken(token: string, secret: string) {
    return jwt.verify(token, secret);
  }

  static signRefreshToken(
    payload: object,
    privateKey: string,
    expiresIn: string | number = '30d',
    algorithm: jwt.Algorithm = 'RS256',
  ) {
    const option: jwt.SignOptions = {
      algorithm: algorithm as jwt.Algorithm,
      expiresIn: expiresIn as ms.StringValue,
    };
    return jwt.sign(payload, privateKey, option);
  }

  static verifyRefreshToken(
    token: string,
    publicKey: string,
    algorithm: jwt.Algorithm = 'RS256',
  ) {
    return jwt.verify(token, publicKey, {
      algorithms: [algorithm as jwt.Algorithm],
    });
  }

  static decode(token: string) {
    return jwt.decode(token);
  }
}
