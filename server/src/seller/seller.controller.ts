import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { UpdateSellerProductDto } from './dto/update-seller-product.dto';
import { SellerStatsQueryDto } from './dto/stats-query.dto';
import { ListSellerProductsQueryDto } from './dto/list-seller-products-query.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  /** `?range=7d|30d|90d|all` — anything else is a 400. Defaults to `all`. */
  @Get('stats')
  async stats(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: SellerStatsQueryDto,
  ) {
    const data = await this.sellerService.getStats(user.userId, query.range);
    return { success: true, data };
  }

  /** `?includeDeleted=true` surfaces soft-deleted products; off by default. */
  @Get('products')
  async listProducts(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListSellerProductsQueryDto,
  ) {
    const data = await this.sellerService.listProducts(
      user.userId,
      query.includeDeleted ?? false,
    );
    return { success: true, data };
  }

  @Post('products')
  async createProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSellerProductDto,
  ) {
    const data = await this.sellerService.createProduct(user.userId, dto);
    return { success: true, data };
  }

  @Patch('products/:id')
  async updateProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateSellerProductDto,
  ) {
    const data = await this.sellerService.updateProduct(user.userId, id, dto);
    return { success: true, data };
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const data = await this.sellerService.softDeleteProduct(user.userId, id);
    return { success: true, data };
  }

  @Get('orders')
  async listOrders(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.sellerService.listOrders(user.userId);
    return { success: true, data };
  }
}
