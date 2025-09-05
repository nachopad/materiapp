import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { getSwaggerConfig } from './core/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if there are extra properties
      transform: true, // transforms payloads into DTO instances
    }),
  );

  // SWAGGER
  const { swaggerConfig, swaggerSetupOptions } = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document, swaggerSetupOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
