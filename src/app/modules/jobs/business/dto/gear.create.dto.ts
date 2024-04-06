import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class GearCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    itemType: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    quantity: number;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    cost: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    weight: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    description: string;
}
