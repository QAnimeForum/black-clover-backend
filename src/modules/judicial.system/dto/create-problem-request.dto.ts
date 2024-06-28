import { ApiProperty } from '@nestjs/swagger';

import { ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProblemStatementDto } from './problem-statement.dto';


export class CreateProblemRequestDto {
    @ApiProperty()
    @ValidateNested()
    @Type(() => ProblemStatementDto)
    readonly statement: ProblemStatementDto;
}
