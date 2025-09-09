import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JWT_ACCESS_EXPIRES_IN, JWT_ACCESS_SECRET } from 'src/core/config';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_ACCESS_SECRET,
      signOptions: { expiresIn: JWT_ACCESS_EXPIRES_IN / 1000 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
