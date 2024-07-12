import { ApiProperty } from '@nestjs/swagger';

export class ProblemMetaDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    displayId?: number;

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
