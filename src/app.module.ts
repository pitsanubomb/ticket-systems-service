import { Module } from '@nestjs/common';
import { TicketController } from './controller/Ticket.controller';

@Module({
  imports: [],
  controllers: [TicketController],
  providers: [],
})
export class AppModule {}
