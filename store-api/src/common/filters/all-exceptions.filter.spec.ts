import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { AllExceptionsFilter } from './all-exceptions.filter';

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
};

const createMockHost = (requestOverrides: Record<string, unknown> = {}) => {
  const request = { method: 'GET', url: '/test', ...requestOverrides };
  const response: MockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const host = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost;
  return { host, response };
};

const createPrismaError = (code: string) =>
  new PrismaClientKnownRequestError('test error', {
    code,
    clientVersion: '7.9.1',
  });

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let loggerErrorSpy: jest.SpyInstance<unknown, unknown[]>;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    loggerErrorSpy.mockRestore();
  });

  it('maps HttpException with Nest-style error name', () => {
    const { host, response } = createMockHost();

    filter.catch(new UnauthorizedException('Invalid token'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 401,
      message: 'Invalid token',
      error: 'Unauthorized',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
      path: '/test',
    });
    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });

  it('extracts validation message arrays from BadRequestException', () => {
    const { host, response } = createMockHost();

    filter.catch(
      new BadRequestException({
        message: ['email must be an email'],
        error: 'Bad Request',
      }),
      host,
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: ['email must be an email'],
        error: 'Bad Request',
      }),
    );
  });

  it('maps P2002 to 409 Conflict', () => {
    const { host, response } = createMockHost();

    filter.catch(createPrismaError('P2002'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Database operation failed',
        error: 'Conflict',
      }),
    );
    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });

  it('maps P2025 to 404 Not Found', () => {
    const { host, response } = createMockHost();

    filter.catch(createPrismaError('P2025'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('maps unknown Prisma codes to 500 and logs them', () => {
    const { host, response } = createMockHost();

    filter.catch(createPrismaError('P2003'), host);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(loggerErrorSpy).toHaveBeenCalled();
  });

  it('maps unknown errors to 500, logs the stack, and hides message in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const { host, response } = createMockHost();
      const error = new Error('secret internal detail');

      filter.catch(error, host);

      expect(response.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          error: 'Internal Server Error',
        }),
      );
      expect(loggerErrorSpy).toHaveBeenCalledWith('GET /test 500', error.stack);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('exposes error message outside production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const { host, response } = createMockHost();

      filter.catch(new Error('boom'), host);

      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'boom' }),
      );
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});
