import { NODE_ENV } from 'src/core/config';
import { CookieOptions, Response } from 'express';

export const setCookie = (
  response: Response,
  name: string,
  value: string,
  options: CookieOptions,
) => {
  response.cookie(name, value, {
    path: '/',
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',

    ...options,
  });
};
