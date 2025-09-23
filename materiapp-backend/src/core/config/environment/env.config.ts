import 'dotenv/config';
import { z } from 'zod';

import {
  bycriptSchema,
  commonSchema,
  databaseSchema,
  googleSchema,
  jwtSchema,
  mailSchema,
} from '@/core/environment';

const envSchema = z.object({
  ...commonSchema.shape,
  ...databaseSchema.shape,
  ...jwtSchema.shape,
  ...googleSchema.shape,
  ...bycriptSchema.shape,
  ...mailSchema.shape,
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  console.error(
    'Environment variable validation failed:',
    z.treeifyError(error),
  );
  process.exit(1);
}

export const {
  NODE_ENV,
  PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SECRET,
  SALT_ROUNDS,
  HOST_MAIL,
  PORT_MAIL,
  SECURE,
  USER_REMITENTE,
  PASSWORD_APP,
} = data;
