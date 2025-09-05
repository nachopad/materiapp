import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
} from './core/config/environment';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
    ),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
