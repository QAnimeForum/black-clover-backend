import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ClothesCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    gender: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    category: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    style: number;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    price: number;
}
