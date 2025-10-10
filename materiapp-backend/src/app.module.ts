import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
} from './core/config/environment';
import { AuthModule } from './module/auth/auth.module';
import { CareerModule } from './module/career/career.module';
import { CollegeModule } from './module/college/college.module';
import {
  AllExceptionFilter,
  TransformResponseInterceptor,
} from './module/common/interceptors';
import { EnrollmentModule } from './module/enrollment/enrollment.module';
import { SecurityModule } from './module/security/security.module';
import { SubjectModule } from './module/subject/subject.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
    ),
    AuthModule,
    SecurityModule,
    UserModule,
    CareerModule,
    SubjectModule,
    CollegeModule,
    EnrollmentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
