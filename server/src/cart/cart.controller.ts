import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.cartService.getCart(user.userId);
    return { success: true, data };
  }

  @Post('items')
  async addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddCartItemDto) {
    const data = await this.cartService.addItem(user.userId, dto);
    return { success: true, data };
  }

  @Patch('items/:id')
  async updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const data = await this.cartService.updateItem(user.userId, id, dto);
    return { success: true, data };
  }

  @Delete('items/:id')
  async removeItem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    const data = await this.cartService.removeItem(user.userId, id);
    return { success: true, data };
  }

  @Post('merge')
  async merge(@CurrentUser() user: AuthenticatedUser, @Body() dto: MergeCartDto) {
    const data = await this.cartService.merge(user.userId, dto);
    return { success: true, data };
  }

  @Delete()
  async clear(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.cartService.clear(user.userId);
    return { success: true, data };
  }
}
