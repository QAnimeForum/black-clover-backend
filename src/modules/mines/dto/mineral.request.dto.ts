import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MineralRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    mineral: string;
}
