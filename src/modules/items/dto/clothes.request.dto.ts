import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ClothesRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    clothes: string;
}
