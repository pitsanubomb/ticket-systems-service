import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

// Cath all error and response
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    
    catch(exception: HttpException, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            method: httpAdapter.getRequestMethod(ctx.getRequest()),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            data: {
                message: exception.message || 'Have Something Error'
            }
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } 
}