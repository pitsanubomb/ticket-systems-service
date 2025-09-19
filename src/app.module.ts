import { Module } from '@nestjs/common';
import { TicketController } from './ticket/ticket.controller';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/filter/AllExceptionsFilter';
import { TransfromInterceptor } from './utils/interceptors/TransfromInterceptor';

@Module({
  imports: [],
  controllers: [TicketController],
  providers: [
    // Interceptor
    {
      provide:APP_INTERCEPTOR,
      useClass: TransfromInterceptor,
    },
    // Filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ],
})
export class AppModule {}
