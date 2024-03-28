import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { DevilFloorEnum } from '../constants/devil.flor.enum';

export class CreateDevilDto {
    @ApiProperty({ example: 'Люциферо' })
    @IsNotEmpty()
    name: string;
    @ApiProperty({ example: 'самый главный дьявол' })
    @IsNotEmpty()
    description: string;
    @ApiProperty({ example: '1 этаж' })
    @IsNotEmpty()
    floor: DevilFloorEnum;
    @ApiProperty({ example: 'высший дьявол' })
    @IsNotEmpty()
    rank: DevilRanksEnum;
    @ApiProperty({ example: 'магия гравитации' })
    @IsNotEmpty()
    magic_type: string;
}