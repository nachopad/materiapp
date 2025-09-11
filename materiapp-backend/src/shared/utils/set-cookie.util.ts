import { CookieOptions, Response } from 'express';

import { NODE_ENV } from '@/core/config';

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
