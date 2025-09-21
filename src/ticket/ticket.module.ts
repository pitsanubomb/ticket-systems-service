import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { TicketService } from './ticket.service';
import { BullModule } from '@nestjs/bullmq';
import { TicketProcessor } from './ticket.processor';
import { TicketSlaProcesser } from './ticket-sla.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'; 

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'TicketNotifyJob',
    }),
    BullModule.registerQueue({
      name: 'TicketSlaJob',
    }),
    BullBoardModule.forFeature({
      name: 'TicketNotifyJob',
      adapter: BullMQAdapter
    },
    {
    name: 'TicketSlaJob',
    adapter: BullMQAdapter
    })
  ],
  controllers: [TicketController],
  providers: [TicketService, TicketProcessor, TicketSlaProcesser],
})
export class TicketModule {}
