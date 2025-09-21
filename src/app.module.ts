import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {ConfigModule} from '@nestjs/config'

import { AllExceptionsFilter } from './utils/filter/AllExceptionsFilter';
import { TransfromInterceptor } from './utils/interceptors/TransfromInterceptor';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // For call preoce.env to config global
    }),
    TicketModule],
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
