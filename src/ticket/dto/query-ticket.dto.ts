import { IsEnum, IsOptional, IsString, IsNumberString, Min } from 'class-validator';
import { Priority, Status } from '@prisma/client';
import { Transform } from 'class-transformer';

export class QueryTicketDto {
  @IsOptional()
  @IsNumberString({}, { message: 'Page must be a valid number' })
  @Transform(({ value }) => parseInt(value))
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @IsNumberString({}, { message: 'Page size must be a valid number' })
  @Transform(({ value }) => parseInt(value))
  @Min(1, { message: 'Page size must be at least 1' })
  'page-size'?: number = 10;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED' })
  status?: Status;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH' })
  priority?: Priority;

  @IsOptional()
  @IsString()
  search?: string;
}