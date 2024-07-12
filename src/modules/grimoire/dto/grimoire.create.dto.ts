import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class GrimoireCreateDto {
    @ApiProperty({ example: 'магия гравитации' })
    @IsNotEmpty()
    magicName?: string;

    @ApiProperty({ example: '' })
    @IsNotEmpty()
    coverSymbol: string;
}
