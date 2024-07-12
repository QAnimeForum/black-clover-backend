import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class SquadCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    name: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    description: string;
    forces_id: string;
}
