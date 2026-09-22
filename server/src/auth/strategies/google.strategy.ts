import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${config.getOrThrow<string>('API_URL')}/auth/google/callback`,
      scope: ['openid', 'email', 'profile'],
    });
  }

  async verify(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email returned from Google'), false);
    }

    const user = await this.authService.findOrCreateGoogleUser({
      googleId: profile.id,
      email,
      fullName: profile.displayName,
    });

    const payload: AuthenticatedUser = { userId: user.id, email: user.email };
    done(null, payload);
  }
}
