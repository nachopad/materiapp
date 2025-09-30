import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { doubleCsrfUtilities } from '@/shared/utils/csrf.util';

@Controller('security')
export class SecurityController {
  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    doubleCsrfUtilities.generateCsrfToken(req, res);
    return { message: 'CSRF token set in cookie' };
  }
}
