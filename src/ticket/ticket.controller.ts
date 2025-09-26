import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { CreateTicketDto, UpdateTicketDto, QueryTicketDto } from "./dto";

@Controller('tickets')
export class TicketController {
    constructor (private readonly ticketService:TicketService) {}
    
    @Get()
    async findAllTickets(@Query(new ValidationPipe({ transform: true })) query: QueryTicketDto) {
        const { page = 1, 'page-size': pageSize = 10, status, priority, search } = query;
        return this.ticketService.findAllTicket(page, pageSize, status, priority, search)
    }

    @Post()
    async createTicket(@Body(ValidationPipe) ticketData: CreateTicketDto) {
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
    async updateTicketById(@Param('id') id:number, @Body(ValidationPipe) ticket: UpdateTicketDto) {
        return this.ticketService.updateTicketById(Number(id), ticket)
    }

    @Delete(':id')
    async deleteTicketById(@Param('id') id: number) {
        return this.ticketService.deleteTicketById(Number(id))
    }

}