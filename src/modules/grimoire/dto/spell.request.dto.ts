import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SpellRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    spell: string;
}
