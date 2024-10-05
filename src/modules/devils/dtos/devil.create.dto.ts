import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class DevilCreateDto {
    @ApiProperty({ example: 'Люциферо' })
    @IsNotEmpty()
    name: string;
    @ApiProperty({ example: 'самый главный дьявол' })
    @IsNotEmpty()
    description: string;
    @ApiProperty({ example: '1 этаж' })
    @IsNotEmpty()
    floor: string;
    @ApiProperty({ example: 'высший дьявол' })
    @IsNotEmpty()
    rank: string;
    @ApiProperty({ example: 'магия гравитации' })
    @IsNotEmpty()
    magicType: string;

    @ApiProperty({ example: 'ссылка на фотографию' })
    @IsNotEmpty()
    image: string;
}
