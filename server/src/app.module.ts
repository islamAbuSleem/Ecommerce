import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthCoreModule } from './auth-core/auth-core.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { SellerModule } from './seller/seller.module';
import { AdminModule } from './admin/admin.module';
import { CommissionModule } from './commission/commission.module';
import { PaymentsModule } from './payments/payments.module';
import { ShippingModule } from './shipping/shipping.module';
import { JwtAuthGuard } from './auth-core/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthCoreModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    SellerModule,
    AdminModule,
    CommissionModule,
    PaymentsModule,
    ShippingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
