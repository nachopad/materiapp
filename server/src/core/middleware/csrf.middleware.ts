// CSRF middleware configuration for protecting mutative API routes using JWT-based session identifiers.
// Authentication endpoints (login, register, logout, refresh) are excluded from CSRF protection.

import { doubleCsrf, CsrfTokenCookieOptions } from 'csrf-csrf';
import {
  NODE_ENV,
  CSRF_SECRET,
  CSRF_EXPIRES_IN,
  JWT_ACCESS_SECRET,
} from '@/core/config';
import jwt from 'jsonwebtoken';

const csrfCookieName =
  NODE_ENV === 'production' ? '__Host-psifi.x-csrf-token' : 'x-csrf-token';

const csrfCookieOptions: CsrfTokenCookieOptions = {
  httpOnly: true,
  sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
  secure: NODE_ENV === 'production',
  path: '/',
  maxAge: CSRF_EXPIRES_IN,
};

export const { generateCsrfToken, validateRequest, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => CSRF_SECRET, // Returns secret for CSRF generation.
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'] as string, // Gets CSRF token from request header.
    getSessionIdentifier: (req) => {
      const access_token = req.cookies['materiapp_access_token'] as string;
      if (!access_token) return 'anon';
      try {
        const payload = jwt.verify(
          access_token,
          JWT_ACCESS_SECRET,
        ) as jwt.JwtPayload;
        return payload.sub as string;
      } catch {
        return 'anon';
      }
    }, // Identifies session by JWT sub claim.
    cookieName: csrfCookieName, // Name for CSRF cookie.
    cookieOptions: csrfCookieOptions,
    size: 32, // Size for CSRF random value.
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // Methods that do not require CSRF protection.
    skipCsrfProtection: (req) => {
      const { method, originalUrl } = req;
      // Skip CSRF for auth endpoints responsible for creating or destroying authentication/session cookies.
      const skipRoutes = [
        { method: 'POST', url: '/api/auth/login' },
        { method: 'POST', url: '/api/auth/register' },
        { method: 'POST', url: '/api/auth/logout' },
        { method: 'POST', url: '/api/auth/refresh' },
      ];

      for (const route of skipRoutes) {
        if (method === route.method && originalUrl.startsWith(route.url)) {
          return true;
        }
      }
      // All other requests will be protected by CSRF
      return false;
    },
  });
