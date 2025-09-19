import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Status, Priority } from '@prisma/client';

@Injectable()
export class TicketService {
    private Logger = new Logger('TICKET SERVICES');
    constructor(private prisma: PrismaService) {}

    async createTicket(title: string, description: string, priority:Priority) {
        this.Logger.log('Create Tickets')
        return await this.prisma.ticket.create({
            data: {
                title,
                description,
                priority 
            }
        })
    }

    async findAllTicket(page: number, limit: number, status?: Status, priority?: Priority, title?:string) {
        this.Logger.log('Get all Tickets');
        const pageSize = limit; // Number of items per page
        const skip = (page - 1) * limit; // Calculate skip value

        // const where =  {
        //     title,
        //     status,
        //     priority,
        // };

        const tickets = await this.prisma.ticket.findMany({
            skip,
            take: pageSize,
            orderBy: {
                id: 'desc'
            }
        });

        const total = await this.prisma.ticket.count()

        return { tickets, total, page, pageSize} 
    }
}