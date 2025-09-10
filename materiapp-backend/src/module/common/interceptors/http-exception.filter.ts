import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
    _metadata: {
        statusCode: number;
        timestamp: string;
        path: string;
    };
    message: string | string[];
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const exceptionResponse: ErrorResponse = {
            _metadata: {
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
            message: exception.message
        }

        response
            .status(status)
            .json(exceptionResponse);
    }
}