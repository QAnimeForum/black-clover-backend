import { ApiProperty } from '@nestjs/swagger';
import { ProblemType } from '../entity/problem.entity';

export class ProblemMetaDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    displayId?: number;

    @ApiProperty()
    type: ProblemType;

    @ApiProperty()
    isPublic: boolean;

    @ApiProperty()
    publicTime: Date;

    @ApiProperty()
    ownerId: string;

    @ApiProperty()
    submissionCount?: number;

    @ApiProperty()
    acceptedSubmissionCount?: number;
}
