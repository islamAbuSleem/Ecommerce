import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      clientID: config.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: `${config.getOrThrow<string>('API_URL')}/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async verify(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const email =
      profile.emails?.[0]?.value ??
      profile.username ??
      profile.id;

    const user = await this.authService.findOrCreateGithubUser({
      githubId: profile.id,
      email,
      fullName: profile.displayName || profile.username,
    });

    const payload: AuthenticatedUser = { userId: user.id, email: user.email };
    done(null, payload);
  }
}
