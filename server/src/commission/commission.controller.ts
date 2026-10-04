import { Controller, Get } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Controller('commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get('seller')
  async seller(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.commissionService.sellerEarnings(user.userId);
    return { success: true, data };
  }

  @Get('admin')
  async admin(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.commissionService.adminCommissionOverview(
      user.userId,
    );
    return { success: true, data };
  }
}
