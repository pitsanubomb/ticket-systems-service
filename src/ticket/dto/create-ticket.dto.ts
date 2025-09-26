import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Priority, Status } from '@prisma/client';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(250, { message: 'Title must not exceed 250 characters' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description: string;

  @IsEnum(Priority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH' })
  priority: Priority;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED' })
  status?: Status;
}