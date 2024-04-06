import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RankRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    rank: string;
}
