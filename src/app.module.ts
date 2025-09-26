import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TransfromInterceptor } from './utils/interceptors/TransfromInterceptor';
import { TicketModule } from './ticket/ticket.module';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // For call preoce.env to config global
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues', // Base route for the dashboard
      adapter: ExpressAdapter
    }),
    AdminModule,
    TicketModule,
  ],
  providers: [
    // Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TransfromInterceptor,
    },
  ],
})
export class AppModule { }
