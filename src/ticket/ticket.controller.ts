import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { CreateTicketDto, UpdateTicketDto, QueryTicketDto, TicketParamDto } from "./dto";

@Controller('tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}
    
    @Get()
    async findAllTickets(@Query() query: QueryTicketDto) {
        const { page = 1, 'page-size': pageSize = 10, status, priority, search, orderBy, orderDirection } = query;
        return this.ticketService.findAllTicket(page, pageSize, status, priority, search, orderBy, orderDirection);
    }

    @Post()
    async createTicket(@Body() ticketData: CreateTicketDto) {
        const { title, description, priority, status } = ticketData;
        await this.ticketService.createTicket(title, description, priority, status);
        
        return {
            message: 'Create ticket successfully'
        };
    }

    @Get(':id')
    async findTicketById(@Param() params: TicketParamDto) {
        return this.ticketService.findTicketById(params.id);
    }

    @Put(':id')
    async updateTicketById(@Param() params: TicketParamDto, @Body() ticket: UpdateTicketDto) {
        return this.ticketService.updateTicketById(params.id, ticket);
    }

    @Delete(':id')
    async deleteTicketById(@Param() params: TicketParamDto) {
        return this.ticketService.deleteTicketById(params.id);
    }
}