import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Status, Priority, Prisma, Ticket } from '@prisma/client';
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class TicketService {
    private Logger = new Logger('TICKET SERVICES');
    constructor(private prisma: PrismaService, @InjectQueue('TicketNotifyJob') private notificationQueue: Queue, @InjectQueue('TicketSlaJob') private ticketSlaQue: Queue) {}

    async createTicket(title: string, description: string, priority:Priority, status?: Status) {
        this.Logger.log('Create Tickets')
        const { id: ticketId } =  await this.prisma.ticket.create({
            data: {
                title,
                description,
                priority,
                status 
            },
            select: {
                id: true
            }
        });


        await this.notificationQueue.add('CREATE', {
            ticketId,
            title: title,
            priority: priority,
            status: 'OPEN',
            type: 'CREATE'
        }, {
            jobId: `notify-${ticketId}`
        });

        await this.ticketSlaQue.add('CHECK', {
            id: ticketId
        }, {
            jobId: `sla-${ticketId}`,
            delay: 15 * 60 * 1000
        })
        

        return {
            message: 'Create ticket successfully'
        }
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
        this.Logger.log(`Find ticket by id: ${id}`);
        const response =  await this.prisma.ticket.findUnique({where: {id}});

        if(!response) {
            throw new NotFoundException(`Can't Get Ticket with id ${id} not found`);
        }

        await this.notificationQueue.add('READ', {
            ticketId: id,
            title: response.title,
            priority: response.priority,
            status: response.status,
            type: 'READ'
        }, {
            jobId: `notify-${id}`
        });

        return response;
    }

    async updateTicketById(id: number, data:{ title: string, description: string, status: Status, priority: Priority}) {
        this.Logger.log(`Update tickets by id: ${id}`)
        const jobId = `sla-${id}`;
        const response =  await this.prisma.ticket.update(
        {
            where: {
                id
            },
            data
        });
        
        if(!response) {
            throw new NotFoundException(`Can't Update Ticket with id ${id} not found`);
        }

       await this.notificationQueue.add('UPDATE', {
            ticketId: id,
            title: response.title,
            priority: response.priority,
            status: response.status,
            type: 'UPDATE'
        }, {
            jobId: `notify-${id}`
        });


        const slaQue = await this.ticketSlaQue.getJob(jobId)

        // Update Que (Add Que) If status != RESOLVED And Remove is RESOLVED
        if(response.status === Status.RESOLVED && slaQue) {
            await this.ticketSlaQue.remove(jobId)
            this.Logger.log(`Remove Job: ${id} as ticketId: ${id}`)
        } else if(response.status !== Status.RESOLVED && slaQue) {
            await slaQue.updateData({
                id: id
            })
        } else if(response.status !== Status.RESOLVED && !slaQue) {
            this.ticketSlaQue.add('CHECK', {
                id: id
            },{
                jobId: jobId,
                delay: 15 * 60 * 1000
            })
        } else {
            this.Logger.log(`Ticket id: ${id} is resolved`)
        }

        return response;
    }

    async deleteTicketById(id: number) {
        this.Logger.log(`Delete ticket by id: ${id}`)
        const response =  await this.prisma.ticket.delete({where: {id}})

        if(!response) {
            throw new NotFoundException(`Can't Delete Ticket with id ${id} not found`)
        }

        await this.notificationQueue.add('DELETE', {
            ticketId:id,
            title:response.title,
            priority: response.priority,
            status: response.status,
            type: 'DELETE'
        }, {
            jobId: `notify-${id}`
        })

        return response;
    }
}