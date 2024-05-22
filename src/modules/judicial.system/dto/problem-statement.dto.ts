import { ApiProperty } from '@nestjs/swagger';

import { IsArray, ArrayMaxSize, IsInt } from 'class-validator';

export class ProblemStatementDto {
    @ApiProperty({ type: [Number] })
    @IsInt({ each: true })
    @IsArray()
    @ArrayMaxSize(20)
    problemTagIds: number[];
}
