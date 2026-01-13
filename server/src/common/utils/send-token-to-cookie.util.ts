import { Response } from 'express';
import ms from 'ms';

export function sendTokenToCookie(
  res: Response,
  name: string,
  token: string,
  path: string,
  maxAge: ms.StringValue,
  secure: boolean | undefined,
) {
  res.cookie(name, token, {
    httpOnly: true,
    maxAge: ms(maxAge),
    path,
    secure,
  });
}
