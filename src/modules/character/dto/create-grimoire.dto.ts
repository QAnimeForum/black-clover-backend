import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class DevilCreateDto {
    @ApiProperty({ example: '75a12365-5f48-4778-be42-b92035f44fba' })
    @IsNotEmpty()
    characterId: string;
    @ApiProperty({ example: 'магия гравитации' })
    @IsNotEmpty()
    magicName: string;


    @ApiProperty({ example: '75a12365-5f48-4778-be42-b92035f44fba' })
    @IsNotEmpty()
    stateId: string;
}
