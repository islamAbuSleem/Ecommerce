import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signToken(user: { id: string; email: string }) {
    return this.jwt.signAsync({ sub: user.id, email: user.email });
  }

  async register(dto: RegisterDto) {
    const existing = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hash = await bcrypt.hash(
      dto.password,
      Number(this.config.getOrThrow('SALT_ROUNDS')),
    );

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: hash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: true,
      },
    });
    const unauthorized = new UnauthorizedException(
      'Email or password is incorrect',
    );
    if (!user) {
      throw unauthorized;
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw unauthorized;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async me(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return user;
  }
}
