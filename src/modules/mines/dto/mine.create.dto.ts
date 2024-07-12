import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class MineCreateDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    name: string;
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    description: string;
}
