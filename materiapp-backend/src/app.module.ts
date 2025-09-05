import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
} from './core/config/environment';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
