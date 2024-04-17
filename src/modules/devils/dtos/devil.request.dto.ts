import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DevilRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    devil: string;
}
