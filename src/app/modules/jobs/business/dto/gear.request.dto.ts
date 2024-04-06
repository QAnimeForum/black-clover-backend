import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GearRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    gear: string;
}
