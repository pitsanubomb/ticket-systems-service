import { Module } from '@nestjs/common';
import { TicketController } from './ticket/ticket.controller';

@Module({
  imports: [],
  controllers: [TicketController],
  providers: [],
})
export class AppModule {}
