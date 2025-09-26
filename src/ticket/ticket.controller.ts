import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiQuery, 
    ApiParam,
    ApiBody,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiCreatedResponse
} from '@nestjs/swagger';
import { TicketService } from "./ticket.service";
import { CreateTicketDto, UpdateTicketDto, QueryTicketDto, TicketParamDto } from "./dto";

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}
    
    @Get()
    @ApiOperation({ 
        summary: 'Get all tickets',
        description: 'Retrieve a paginated list of tickets with optional filtering, searching, and sorting capabilities'
    })
    @ApiOkResponse({
        description: 'Successfully retrieved tickets',
        schema: {
            type: 'object',
            properties: {
                tickets: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            title: { type: 'string', example: 'Bug in user authentication' },
                            description: { type: 'string', example: 'Users are unable to log in' },
                            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], example: 'HIGH' },
                            status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], example: 'OPEN' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                },
                total: { type: 'number', example: 50 },
                page: { type: 'number', example: 1 },
                pageSize: { type: 'number', example: 10 }
            }
        }
    })
    @ApiBadRequestResponse({ description: 'Invalid query parameters' })
    async findAllTickets(@Query() query: QueryTicketDto) {
        const { page = 1, 'page-size': pageSize = 10, status, priority, search, orderBy, orderDirection } = query;
        return this.ticketService.findAllTicket(page, pageSize, status, priority, search, orderBy, orderDirection);
    }

    @Post()
    @ApiOperation({ 
        summary: 'Create a new ticket',
        description: 'Create a new support ticket with title, description, priority, and optional status'
    })
    @ApiBody({ type: CreateTicketDto })
    @ApiCreatedResponse({
        description: 'Ticket created successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Create ticket successfully' }
            }
        }
    })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async createTicket(@Body() ticketData: CreateTicketDto) {
        const { title, description, priority, status } = ticketData;
        await this.ticketService.createTicket(title, description, priority, status);
        
        return {
            message: 'Create ticket successfully'
        };
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Get ticket by ID',
        description: 'Retrieve a specific ticket by its unique identifier'
    })
    @ApiParam({ name: 'id', type: 'number', description: 'Ticket ID', example: 123 })
    @ApiOkResponse({
        description: 'Successfully retrieved ticket',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 123 },
                title: { type: 'string', example: 'Bug in user authentication' },
                description: { type: 'string', example: 'Users are unable to log in with their credentials' },
                priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], example: 'HIGH' },
                status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], example: 'OPEN' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiNotFoundResponse({ description: 'Ticket not found' })
    @ApiBadRequestResponse({ description: 'Invalid ticket ID' })
    async findTicketById(@Param() params: TicketParamDto) {
        return this.ticketService.findTicketById(params.id);
    }

    @Put(':id')
    @ApiOperation({ 
        summary: 'Update ticket by ID',
        description: 'Update an existing ticket with new information'
    })
    @ApiParam({ name: 'id', type: 'number', description: 'Ticket ID', example: 123 })
    @ApiBody({ type: UpdateTicketDto })
    @ApiOkResponse({
        description: 'Successfully updated ticket',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 123 },
                title: { type: 'string', example: 'Bug in user authentication - Fixed' },
                description: { type: 'string', example: 'The authentication issue has been resolved' },
                priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], example: 'MEDIUM' },
                status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], example: 'RESOLVED' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiNotFoundResponse({ description: 'Ticket not found' })
    @ApiBadRequestResponse({ description: 'Invalid input data or ticket ID' })
    async updateTicketById(@Param() params: TicketParamDto, @Body() ticket: UpdateTicketDto) {
        return this.ticketService.updateTicketById(params.id, ticket);
    }

    @Delete(':id')
    @ApiOperation({ 
        summary: 'Delete ticket by ID',
        description: 'Permanently delete a ticket from the system'
    })
    @ApiParam({ name: 'id', type: 'number', description: 'Ticket ID', example: 123 })
    @ApiOkResponse({
        description: 'Successfully deleted ticket',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 123 },
                title: { type: 'string', example: 'Bug in user authentication' },
                description: { type: 'string', example: 'Users are unable to log in with their credentials' },
                priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], example: 'HIGH' },
                status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], example: 'OPEN' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiNotFoundResponse({ description: 'Ticket not found' })
    @ApiBadRequestResponse({ description: 'Invalid ticket ID' })
    async deleteTicketById(@Param() params: TicketParamDto) {
        return this.ticketService.deleteTicketById(params.id);
    }
}