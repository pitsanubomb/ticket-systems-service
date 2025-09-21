import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { TicketService } from './ticket.service';
import { BullModule } from '@nestjs/bullmq';
import { TicketProcessor } from './ticket.processor';
import { TicketSlaProcesser } from './ticket-sla.processor';

@Module({
    imports: [
        PrismaModule,
        BullModule.forRoot({
          connection: {
            host: 'localhost',
            port: 6379
          },
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            }
          }
        }),
        BullModule.registerQueue({
            name: 'TicketNotifyJob'
        }),
        BullModule.registerQueue({
            name: 'TicketSlaJob'
        })
    ],
    controllers: [TicketController],
    providers: [TicketService,TicketProcessor,TicketSlaProcesser],
})
export class TicketModule {}