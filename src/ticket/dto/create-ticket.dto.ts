import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Priority, Status } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({
    description: 'The title of the ticket',
    example: 'Bug in user authentication',
    minLength: 5,
    maxLength: 250,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(250, { message: 'Title must not exceed 250 characters' })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the ticket',
    example: 'Users are unable to log in with their credentials. The login form returns a 500 error.',
    maxLength: 5000,
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description: string;

  @ApiProperty({
    description: 'Priority level of the ticket',
    enum: Priority,
    example: Priority.HIGH,
  })
  @IsNotEmpty({ message: 'Priority is required' })
  @IsEnum(Priority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH' })
  priority: Priority;

  @ApiProperty({
    description: 'Initial status of the ticket',
    enum: Status,
    example: Status.OPEN,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status, { message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED' })
  status?: Status;
}