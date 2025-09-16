import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
} from './core/config/environment';
import { AuthModule } from './module/auth/auth.module';
import { CollegeModule } from './module/college/college.module';
import { HttpExceptionFilter, TransformResponseInterceptor } from './module/common/interceptors';
import { UserModule } from './module/user/user.module';
import { CareerModule } from './module/career/career.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
    ),
    UserModule,
    CareerModule,
    AuthModule,
    CollegeModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ]
})
export class AppModule { }
