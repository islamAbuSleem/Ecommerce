import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { STATUS_CODES } from 'node:http';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Request, Response } from 'express';

type ErrorBody = {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body = this.toErrorBody(exception, request);

    if (body.statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${body.statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(body.statusCode).json(body);
  }

  private toErrorBody(exception: unknown, request: Request): ErrorBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const message = this.extractMessage(exception);

      return {
        statusCode,
        message,
        error: this.statusName(statusCode),
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      const statusCode = this.prismaStatusCode(exception.code);
      return {
        statusCode,
        message: 'Database operation failed',
        error: this.statusName(statusCode),
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    return {
      statusCode,
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : exception instanceof Error
            ? exception.message
            : 'Unknown error',
      error: this.statusName(statusCode),
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  private extractMessage(exception: HttpException): string | string[] {
    const response = exception.getResponse();
    if (typeof response === 'string') return response;
    if (typeof response === 'object' && response !== null) {
      const message = (response as { message?: string | string[] }).message;
      if (message) return message;
    }
    return exception.message;
  }

  private prismaStatusCode(code: string): HttpStatus {
    switch (code) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private statusName(statusCode: number): string {
    return STATUS_CODES[statusCode] ?? 'Error';
  }
}
