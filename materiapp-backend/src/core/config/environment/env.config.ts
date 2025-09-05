import 'dotenv/config';
import { z } from 'zod';

import { commonSchema, databaseSchema, jwtSchema } from 'src/core/environment';

const envSchema = z.object({
  ...commonSchema.shape,
  ...databaseSchema.shape,
  ...jwtSchema.shape,
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
} = data;
