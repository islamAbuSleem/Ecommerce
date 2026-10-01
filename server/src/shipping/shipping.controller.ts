import { Body, Controller, Get, Post } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('config')
  config() {
    return {
      success: true,
      data: { configured: this.shippingService.isConfigured() },
    };
  }

  @Post('rates')
  async rates(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { origin: string; destination: string },
  ) {
    const data = await this.shippingService.getRates(
      body.origin,
      body.destination,
    );
    return { success: true, data };
  }
}
