import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ArmorRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    armor: string;
}
