import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './core/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SWAGGER
  const { swaggerConfig, swaggerSetupOptions } = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document, swaggerSetupOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
