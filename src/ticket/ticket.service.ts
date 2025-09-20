import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Status, Priority, Prisma, Ticket } from '@prisma/client';

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

    async findAllTicket(page: number, limit: number, status?: Status, priority?: Priority, search?:string, orderBy?:string, orderDirection? :string) {
        this.Logger.log('Get all Tickets');
        const pageSize = limit; // Number of items per page
        const skip = (page - 1) * limit; // Calculate skip value

        const where: Prisma.TicketWhereInput = {}

        if (search) {
            console.debug(search)
            where.OR = [
                {
                    title: {contains: search, mode: 'insensitive'},
                },
                {
                    description: {contains: search, mode: 'insensitive'},
                }
            ]
        }

        if (status) {
            where.status = status
        }

        if (priority) {
            where.priority = priority
        }

        const orderByClause:Prisma.TicketOrderByWithRelationInput = {}

        const validateOrderby:(keyof Ticket)[] = ['id', 'title', 'priority' , 'status'];
        
        // Check is orderby data is correct
        if (validateOrderby.includes((orderBy as keyof Ticket))) {
            orderByClause[orderBy as keyof Ticket] = orderDirection as Prisma.SortOrder;
        } else {
            orderByClause.id = 'desc';
        }

        const tickets = await this.prisma.ticket.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: orderByClause
        });

        const total = await this.prisma.ticket.count({where})

        return { tickets, total, page, pageSize} 
    }

    async findTicketById(id: number) {
        this.Logger.log(`Find ticket by id: ${id}`)
        return this.prisma.ticket.findUnique({where: {id}})
    }

    async updateTicketById(id: number, data:{ title: string, description: string, status: Status, priority: Priority}) {
        this.Logger.log(`Update tickets by id: ${id}`)
        return await this.prisma.ticket.update(
        {
            where: {
                id
            },
            data
        });
    }

    async deleteTicketById(id: number) {
        this.Logger.log(`Delete ticket by id: ${id}`)
        return this.prisma.ticket.delete({where: {id}})
    }
}