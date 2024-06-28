import { ApiProperty } from '@nestjs/swagger';

export class SubmissionBasicMetaDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    isPublic: boolean;

    @ApiProperty({ enum: PermissionStatus })
    status: PermissionStatus;

    @ApiProperty()
    submitTime: Date;
}
