import { IsEnum, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Priority, Status } from '@prisma/client';
import { Type } from 'class-transformer';

export class QueryTicketDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  'page-size'?: number;

  @ApiPropertyOptional({
    description: 'Filter tickets by status',
    enum: Status,
    example: Status.OPEN,
  })
  @IsOptional()
  @IsEnum(Status, { message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED' })
  status?: Status;

  @ApiPropertyOptional({
    description: 'Filter tickets by priority level',
    enum: Priority,
    example: Priority.HIGH,
  })
  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH' })
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Search term to filter tickets by title or description',
    example: 'authentication bug',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to order results by',
    enum: ['id', 'title', 'priority', 'status'],
    example: 'priority',
  })
  @IsOptional()
  @IsString()
  @IsIn(['id', 'title', 'priority', 'status'], { message: 'orderBy must be one of: id, title, priority, status' })
  orderBy?: string;

  @ApiPropertyOptional({
    description: 'Order direction for sorting',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'orderDirection must be either asc or desc' })
  orderDirection?: string;
}