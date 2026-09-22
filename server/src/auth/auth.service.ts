import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { Role, SellerStatus } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { authCookie } from '../common/config/auth-cookie.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashed,
        fullName: dto.fullName,
        role: dto.role,
      },
      select: { id: true, email: true, fullName: true, role: true, sellerStatus: true },
    });
    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, fullName: true, passwordHash: true, role: true, sellerStatus: true },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueToken(user);
  }

  async authenticateOAuth(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true, sellerStatus: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.issueToken(user);
  }

  private async issueToken(user: { id: string; email: string; fullName: string | null; role: Role; sellerStatus: SellerStatus | null }) {
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return {
      token,
      cookie: authCookie(),
      user: { id: user.id, email: user.email, fullName: user.fullName ?? null, role: user.role, sellerStatus: user.sellerStatus },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true, sellerStatus: true, createdAt: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async findOrCreateGoogleUser(data: { googleId: string; email: string; fullName: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { googleId: data.googleId },
      select: { id: true, email: true, fullName: true, role: true, sellerStatus: true },
    });
    if (existing) return existing;

    return this.prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,
        fullName: data.fullName,
        role: 'buyer',
      },
      select: { id: true, email: true, fullName: true, role: true, sellerStatus: true },
    });
  }

  async findOrCreateGithubUser(data: { githubId: string; email: string; fullName: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { githubId: data.githubId },
      select: { id: true, email: true, fullName: true, role: true, sellerStatus: true },
    });
    if (existing) return existing;

    return this.prisma.user.create({
      data: {
        githubId: data.githubId,
        email: data.email,
        fullName: data.fullName,
        role: 'buyer',
      },
      select: { id: true, email: true, fullName: true, role: true, sellerStatus: true },
    });
  }
}
