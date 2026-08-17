import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaUser: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
  let configGetOrThrow: jest.Mock;
  let jwtSignAsync: jest.Mock;

  const userRow = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'John Doe',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
  };

  beforeEach(async () => {
    prismaUser = {
      findUnique: jest.fn(),
      create: jest.fn(),
    };
    configGetOrThrow = jest.fn((key: string) => {
      if (key === 'SALT_ROUNDS') return '4';
      if (key === 'JWT_EXPIRES_IN') return '1h';
      throw new Error(`unexpected key: ${key}`);
    });
    jwtSignAsync = jest.fn().mockResolvedValue('jwt-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: { user: prismaUser },
        },
        {
          provide: ConfigService,
          useValue: { getOrThrow: configGetOrThrow },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jwtSignAsync },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    it('throws ConflictException when the email already exists', async () => {
      prismaUser.findUnique.mockResolvedValue(userRow);

      await expect(
        service.register({
          email: 'user@example.com',
          password: 'password123',
          name: 'John Doe',
        }),
      ).rejects.toThrow(ConflictException);
      expect(prismaUser.create).not.toHaveBeenCalled();
    });

    it('hashes the password and returns a sanitized user', async () => {
      prismaUser.findUnique.mockResolvedValue(null);
      const createdArgs: Array<{
        data: { email: string; passwordHash: string };
      }> = [];
      prismaUser.create.mockImplementation(
        (input: { data: { email: string; passwordHash: string } }) => {
          createdArgs.push(input);
          return Promise.resolve(userRow);
        },
      );

      const result = await service.register({
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      expect(result).toEqual(userRow);
      expect(createdArgs[0].data.email).toBe('user@example.com');
      expect(createdArgs[0].data.passwordHash).not.toBe('password123');
      await expect(
        bcrypt.compare('password123', createdArgs[0].data.passwordHash),
      ).resolves.toBe(true);
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when the email is unknown', async () => {
      prismaUser.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException on wrong password', async () => {
      prismaUser.findUnique.mockResolvedValue({
        ...userRow,
        passwordHash: await bcrypt.hash('password123', 4),
      });

      await expect(
        service.login({ email: 'user@example.com', password: 'wrongpass1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns a sanitized user on valid credentials', async () => {
      prismaUser.findUnique.mockResolvedValue({
        ...userRow,
        passwordHash: await bcrypt.hash('password123', 4),
      });

      const result = await service.login({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(result).toEqual(userRow);
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('me', () => {
    it('throws UnauthorizedException when the user no longer exists', async () => {
      prismaUser.findUnique.mockResolvedValue(null);

      await expect(service.me('missing-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns the user when found', async () => {
      prismaUser.findUnique.mockResolvedValue(userRow);

      await expect(service.me('user-1')).resolves.toEqual(userRow);
    });
  });

  describe('signToken', () => {
    it('signs a JWT with sub and email claims', async () => {
      const token = await service.signToken({
        id: 'user-1',
        email: 'user@example.com',
      });

      expect(token).toBe('jwt-token');
      expect(jwtSignAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'user@example.com',
      });
    });
  });
});
