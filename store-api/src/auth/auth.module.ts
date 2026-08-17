import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCoreModule } from '../auth-core/auth-core.module';

@Module({
  imports: [AuthCoreModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
