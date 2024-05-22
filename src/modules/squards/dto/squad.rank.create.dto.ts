import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class SquadRankCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    name: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    description: string;

    salary_id: string;
}
