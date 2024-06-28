import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SquadRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    squad: string;
}
