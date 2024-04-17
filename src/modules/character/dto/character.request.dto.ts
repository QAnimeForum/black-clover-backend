import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CharacterRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    character: string;
}
