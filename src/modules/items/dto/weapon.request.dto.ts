import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class WeaponRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    weapon: string;
}
