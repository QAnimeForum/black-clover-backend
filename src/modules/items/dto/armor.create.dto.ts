import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ArmorCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    name: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    armorType: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    cost: string;

    ac: {
        base: number;
        bonus: number;
    };
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    strengthPrerequisite: number;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    stealthDisadvantage: boolean;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    weight: string;
}
