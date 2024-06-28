import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class WeaponCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    name: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    weaponType: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    cost: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    damage: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    damageType: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    weight: string;
}
