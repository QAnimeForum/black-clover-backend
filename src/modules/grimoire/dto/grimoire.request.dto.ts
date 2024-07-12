import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GrimoireRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    grimoire: string;
}
