import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

interface Response<T> {
    _metadata: {
        statusCode: number;
        timestamp: string;
        path: string;
    }
    data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(map(data => ({
            _metadata: {
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
            data
        })));
    }
}