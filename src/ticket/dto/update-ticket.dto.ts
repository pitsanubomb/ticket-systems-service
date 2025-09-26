import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Priority, Status } from '@prisma/client';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'The updated title of the ticket',
    example: 'Bug in user authentication - Fixed',
    minLength: 5,
    maxLength: 250,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(250, { message: 'Title must not exceed 250 characters' })
  title: string;

  @ApiProperty({
    description: 'Updated detailed description of the ticket',
    example: 'The authentication issue has been resolved by updating the JWT token validation logic.',
    maxLength: 5000,
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description: string;

  @ApiProperty({
    description: 'Current status of the ticket',
    enum: Status,
    example: Status.RESOLVED,
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(Status, { message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED' })
  status: Status;

  @ApiProperty({
    description: 'Updated priority level of the ticket',
    enum: Priority,
    example: Priority.MEDIUM,
  })
  @IsNotEmpty({ message: 'Priority is required' })
  @IsEnum(Priority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH' })
  priority: Priority;
}