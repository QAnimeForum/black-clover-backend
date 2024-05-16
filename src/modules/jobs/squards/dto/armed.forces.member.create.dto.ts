import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ArmedForcesMemberCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    character_id: string;

    @ApiProperty({ example: '' })
    @IsNotEmpty()
    armed_forces_id: string;

    @ApiProperty({ example: '' })
    @IsNotEmpty()
    rank_id: string;

}
