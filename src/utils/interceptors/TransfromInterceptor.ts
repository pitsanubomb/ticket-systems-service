import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  statusCode: number;
  method: string;
  path: string;
  data: T;
}

@Injectable()
export class TransfromInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ):Observable<Response<T>> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        
        return next.handle().pipe(map((data) => ({
            statusCode: res.statusCode,
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            data
        })));
    }
}