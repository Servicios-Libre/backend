import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'node:path';

@Controller()
export class AppController {
  @Get()
  serveLanding(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'landing.html'));
  }
}
