import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { generateCsrfToken } from '@/core/middleware/csrf.middleware';
import { ApiVersionHeader } from '@/module/common/decorators';

@ApiVersionHeader('1')
@Controller('security')
export class SecurityController {
  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    generateCsrfToken(req, res);
    return { message: 'CSRF token set in cookie' };
  }
}
