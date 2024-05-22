import { ApiProperty } from '@nestjs/swagger';

import { ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProblemType } from '../entity/problem.entity';
import { ProblemStatementDto } from './problem-statement.dto';


export class CreateProblemRequestDto {
    @ApiProperty()
    @IsEnum(ProblemType)
    readonly type: ProblemType;

    @ApiProperty()
    @ValidateNested()
    @Type(() => ProblemStatementDto)
    readonly statement: ProblemStatementDto;
}
