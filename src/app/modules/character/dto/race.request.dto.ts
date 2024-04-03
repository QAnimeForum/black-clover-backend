import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RaceRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    race: string;
}
