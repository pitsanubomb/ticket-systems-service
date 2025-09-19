import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller('tickets')
export class TicketController {
    constructor () {}
    
    @Get('/')
    @HttpCode(200)
    findAllTickets(): {tickets: Array<{
        id: number,
        title: string,
        priority: string,
        status: string
    }>} {
        return {
            tickets: [
                {
                    id: 1,
                    title: 'Mock I',
                    priority: 'LOW',
                    status: 'OPEN'
                },
                {
                    id: 2,
                    title: 'Mock II',
                    priority: 'MEDIUM',
                    status: 'RESOLVED'
                }
            ]  
        }
    }
}