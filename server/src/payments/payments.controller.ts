import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('config')
  config() {
    return {
      success: true,
      data: { configured: this.paymentsService.isConfigured() },
    };
  }

  @Post('checkout')
  async checkout(
    @CurrentUser() user: AuthenticatedUser,
    @Body('orderId') orderId: string,
  ) {
    const data = await this.paymentsService.createCheckoutSession(
      user.userId,
      orderId,
    );
    return { success: true, data };
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Req() req: RawBodyRequest<Request>) {
    const payload =
      req.rawBody?.toString('utf8') ?? JSON.stringify(req.body ?? {});
    const signature = (req.headers['stripe-signature'] as string) ?? null;
    const data = await this.paymentsService.handleWebhook(payload, signature);
    return { success: true, data };
  }
}
