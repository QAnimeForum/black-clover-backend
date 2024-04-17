import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MineRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    mine: string;
}
