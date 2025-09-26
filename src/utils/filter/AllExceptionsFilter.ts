import { 
    ArgumentsHost, 
    Catch, 
    ExceptionFilter, 
    HttpException, 
    HttpStatus, 
    Logger,
    BadRequestException 
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

// Catch all error and response
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    
    catch(exception: unknown, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        let httpStatus: number;
        let message: string | string[];

        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            
            // Handle different types of HTTP exceptions
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as any;
                
                // For validation errors (BadRequestException), extract validation messages
                if (exception instanceof BadRequestException && Array.isArray(responseObj.message)) {
                    message = responseObj.message;
                } else {
                    message = responseObj.message || responseObj.error || exception.message;
                }
            } else {
                message = exceptionResponse as string;
            }

            // Log different types of errors appropriately
            if (httpStatus >= 500) {
                this.logger.error(`${httpStatus} Error: ${exception.message}`, exception.stack);
            } else if (httpStatus >= 400) {
                this.logger.warn(`${httpStatus} Error: ${exception.message}`);
            }
        } else {
            // Handle unexpected errors (non-HTTP exceptions)
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal Server Error';
            this.logger.error('Unexpected error occurred', exception);
        }

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            method: httpAdapter.getRequestMethod(ctx.getRequest()),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            data: {
                message: Array.isArray(message) ? message : [message]
            }
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } 
}