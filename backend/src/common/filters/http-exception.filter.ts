import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  message?: string | string[];
  [key: string]: unknown;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Custom error response format
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: this.getErrorMessage(exceptionResponse),
      ...(process.env.NODE_ENV === 'development' && {
        details: exceptionResponse,
        stack: exception.stack,
      }),
    };

    // Log error for debugging
    console.error(`[${request.method}] ${request.url} - ${status}`, {
      error: exceptionResponse,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
    });

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(
    exceptionResponse: string | ExceptionResponse | string[] | object,
  ): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (Array.isArray(exceptionResponse)) {
      return exceptionResponse;
    }

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      return exceptionResponse.message || 'Erro interno do servidor';
    }

    return 'Erro interno do servidor';
  }
}
