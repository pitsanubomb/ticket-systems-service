import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/filter/AllExceptionsFilter';
import { TransfromInterceptor } from './utils/interceptors/TransfromInterceptor';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [TicketModule],
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
