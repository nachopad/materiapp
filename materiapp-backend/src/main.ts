import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { AppModule } from './app.module';
import { GOOGLE_SECRET, NODE_ENV, PORT } from './core/config';
import { getSwaggerConfig } from './core/config/swagger';
import { CollegeResponseDto } from './module/college/dtos';
import { ACCEPT_VERSION_HEADER } from './module/common/constants';
import { UserResponseDTO } from './module/user/dtos';
import { CareerResponseDto } from './module/career/dtos';
import { SubjectResponseDto } from './module/subject/dtos';
import { EnrollmentResponseDto } from './module/enrollment/dtos';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if there are extra properties
      transform: true, // transforms payloads into DTO instances
    }),
  );

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: ACCEPT_VERSION_HEADER,
  });

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
      UserResponseDTO,
      CareerResponseDto,
      SubjectResponseDto,
      CollegeResponseDto,
      EnrollmentResponseDto
    ]
  });
  SwaggerModule.setup('/api/docs', app, document, swaggerSetupOptions);

  await app.listen(PORT ?? 3000);
}
bootstrap();
