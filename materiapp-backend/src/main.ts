import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

import { getSwaggerConfig } from './core/config/swagger';
import { GOOGLE_SECRET, NODE_ENV } from './core/config';
import { UserResponseDTO } from './module/user/dtos';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if there are extra properties
      transform: true, // transforms payloads into DTO instances
    }),
  );

  // SESSION TO GOOGLE
  app.use(
    session({
      secret: GOOGLE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: NODE_ENV === 'production',
      },
    }),
  );

  // SWAGGER
  const { swaggerConfig, swaggerSetupOptions } = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [
      UserResponseDTO
    ]
  });
  SwaggerModule.setup('/api/docs', app, document, swaggerSetupOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
