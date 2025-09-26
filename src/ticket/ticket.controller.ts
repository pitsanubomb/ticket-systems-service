import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { Priority, Status } from "@prisma/client";

@Controller('tickets')
export class TicketController {
    constructor (private readonly ticketService:TicketService) {}
    
    @Get()
    async findAllTickets(@Query('page') page: number, @Query('page-size') pageSize: number, @Query('status') status:Status, @Query('priority') priority:Priority ,@Query('search') search?:string) {
        return this.ticketService.findAllTicket(Number(page), Number(pageSize), status, priority, search)
    }

    @Post()
    async createTicket(@Body() ticketData: {
        title: string,
        description: string,
        priority: Priority,
        status?: Status
    }) {
    
        const {title, description, priority, status} = ticketData
        await this.ticketService.createTicket(title, description, priority, status)

        return {
            message: 'Create ticket successfully'    
        }
       
    }

    @Get(':id')
    async findTicketById(@Param('id') id: number) {
        return this.ticketService.findTicketById(Number(id))
    }

    @Put(':id')
    async updateTicketById(@Param('id') id:number, @Body() ticket: {
        title: string,
        description: string,
        status: Status,
        priority: Priority
    }) {
        return this.ticketService.updateTicketById(Number(id), ticket)
    }

    @Delete(':id')
    async deleteTicketById(@Param('id') id: number) {
        return this.ticketService.deleteTicketById(Number(id))
    }

}