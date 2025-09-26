import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class TicketParamDto {
  @Type(() => Number)
  @IsInt({ message: 'ID must be a valid integer' })
  @Min(1, { message: 'ID must be greater than 0' })
  id: number;
}