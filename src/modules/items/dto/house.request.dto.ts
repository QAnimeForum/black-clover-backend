import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class HouseRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    house: string;
}
