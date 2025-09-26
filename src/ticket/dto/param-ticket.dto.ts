import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TicketParamDto {
  @ApiProperty({
    description: 'Unique identifier of the ticket',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'ID must be a valid integer' })
  @Min(1, { message: 'ID must be greater than 0' })
  id: number;
}