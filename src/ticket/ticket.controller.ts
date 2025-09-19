import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { Priority } from "@prisma/client";

@Controller('tickets')
export class TicketController {
    constructor (private readonly ticketService:TicketService) {}
    
    @Get('/')
    @HttpCode(200)
    async findAllTickets() {
        return this.ticketService.findAllTicket(1, 10)
    }

    @Post()
    async createTicket(@Body() ticketData: {
        title: string,
        description: string,
        piority: Priority
    }) {
    
        const {title, description, piority} = ticketData

        try {
            await this.ticketService.createTicket(title, description, piority)

            return {
                message: 'Create ticket successfully'    
            }
        } catch (error) {
            console.debug(error)
        }
       
    }

}