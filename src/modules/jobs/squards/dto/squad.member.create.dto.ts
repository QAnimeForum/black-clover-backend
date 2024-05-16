import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class SquadMemberCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    character_id: string;
    
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    squad_id: string;

    /*
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    rank_id: string;*/
}
