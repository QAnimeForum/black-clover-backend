import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CharacteristicsRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    chracteristics: string;
}
