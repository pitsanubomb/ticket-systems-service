import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { TicketService } from './ticket.service';

@Module({
    imports: [PrismaModule],
    controllers: [TicketController],
    providers: [TicketService],
})
export class TicketModule {}