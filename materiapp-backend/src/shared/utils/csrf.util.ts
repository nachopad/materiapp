import { doubleCsrf, CsrfTokenCookieOptions } from 'csrf-csrf';
import { NODE_ENV, CSRF_SECRET, CSRF_EXPIRES_IN } from '@/core/config';

const csrfCookieName =
  NODE_ENV === 'production' ? '__Host-psifi.x-csrf-token' : 'x-csrf-token';
const csrfCookieOptions: CsrfTokenCookieOptions = {
  httpOnly: true,
  sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
  secure: NODE_ENV === 'production',
  path: '/',
  maxAge: CSRF_EXPIRES_IN,
};

export const doubleCsrfUtilities = doubleCsrf({
  getSecret: () => CSRF_SECRET, // A function that optionally takes the request and returns a secret
  getCsrfTokenFromRequest: (req) => {
    const headerToken = req.headers['x-csrf-token'];
    console.log('[CSRF] Header x-csrf-token:', headerToken);
    return headerToken;
  }, // A function that returns the token from the request
  getSessionIdentifier: (req) => {
    console.log('[CSRF] Session ID:', req.session?.id);
    return req.session?.id;
  }, // A function that returns the unique identifier for the request
  cookieName: csrfCookieName, // The name of the cookie to be used, recommend using Host prefix.
  cookieOptions: csrfCookieOptions,
  size: 32, // The size of the random value used to construct the message used for hmac generation
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // A list of request methods that will not be protected.
  //skipCsrfProtection: undefined,
});
