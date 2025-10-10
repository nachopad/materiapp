import { Module } from '@nestjs/common';
import { SecurityController } from './controllers/security.controller';

@Module({
  imports: [],
  controllers: [SecurityController],
  providers: [],
  exports: [],
})
export class SecurityModule {}
