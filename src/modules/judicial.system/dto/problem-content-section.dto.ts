import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsString, Length, IsEnum, IsOptional } from 'class-validator';

export enum ProblemContentSectionType {
    Text = 'Text',
    Sample = 'Sample',
}

export interface ProblemContentSection {
    sectionTitle: string;
    type: ProblemContentSectionType;

    // If it's a text section, the sampleId is empty
    sampleId?: number;

    // If it's a sample section, the text is the explanation
    text?: string;
}

export class ProblemContentSectionDto implements ProblemContentSection {
    @ApiProperty()
    @IsString()
    @Length(1, 120)
    sectionTitle: string;

    @ApiProperty()
    @IsEnum(ProblemContentSectionType)
    type: ProblemContentSectionType;

    // If it's a text section, the sampleId is empty
    @ApiProperty()
    @IsInt()
    @IsOptional()
    sampleId?: number;

    // If it's a sample section, the text is the explanation
    @ApiProperty()
    @IsString()
    @IsOptional()
    text?: string;
}
