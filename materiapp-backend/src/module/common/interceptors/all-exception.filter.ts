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

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = 500;
        let errorMessage = 'Internal Server Error';

        if (exception instanceof Error) {
            if (exception instanceof HttpException) {
                status = exception.getStatus();
                const exceptionResponse = exception.getResponse();
                if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                    errorMessage = (exceptionResponse as any).message || errorMessage;
                } else {
                    errorMessage = String(exceptionResponse);
                }
            } else {
                if (typeof exception === 'object' && exception !== null) {
                    errorMessage = (exception as any).message || errorMessage;
                }
            }
        }

        const exceptionResponse: ErrorResponse = {
            _metadata: {
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
            message: errorMessage
        }

        response
            .status(status)
            .json(exceptionResponse);
    }
}