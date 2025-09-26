import { IsEnum, IsOptional, IsString, IsIn } from 'class-validator';
import { Priority, Status } from '@prisma/client';
import { Type } from 'class-transformer';

export class QueryTicketDto {
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  'page-size'?: number;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED' })
  status?: Status;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH' })
  priority?: Priority;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['id', 'title', 'priority', 'status'], { message: 'orderBy must be one of: id, title, priority, status' })
  orderBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'orderDirection must be either asc or desc' })
  orderDirection?: string;
}