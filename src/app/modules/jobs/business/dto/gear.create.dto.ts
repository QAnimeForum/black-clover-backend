import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateGearDto {
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
