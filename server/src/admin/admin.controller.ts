import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { SellerApplicationsQueryDto } from './dto/seller-applications-query.dto';
import { ReviewSellerApplicationDto } from './dto/review-seller-application.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * `?status=pending|approved|rejected|all` — defaults to `pending` so the
   * endpoint returns the actionable work with no query at all. Ordered oldest
   * application first.
   */
  @Get('seller-applications')
  async listApplications(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: SellerApplicationsQueryDto,
  ) {
    const data = await this.adminService.listApplications(
      user.userId,
      query.status,
    );
    return { success: true, data };
  }

  /** Full application record, including the products the applicant has listed. */
  @Get('seller-applications/:id')
  async getApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const data = await this.adminService.getApplication(user.userId, id);
    return { success: true, data };
  }

  /** Approve or decline an application. Re-deciding a resolved one is allowed. */
  @Patch('seller-applications/:id')
  async reviewApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ReviewSellerApplicationDto,
  ) {
    const data = await this.adminService.reviewApplication(
      user.userId,
      id,
      dto,
    );
    return { success: true, data };
  }
}
