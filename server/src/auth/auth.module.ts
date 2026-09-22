import { Module } from '@nestjs/common';
import { AuthCoreModule } from '../auth-core/auth-core.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';

@Module({
  imports: [AuthCoreModule],
  providers: [AuthService, GoogleStrategy, GitHubStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
