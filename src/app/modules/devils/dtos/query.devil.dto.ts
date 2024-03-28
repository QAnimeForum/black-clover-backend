import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { Devil } from '../domain/devil';
import { RequestPaginationSerialization } from 'src/utils/RequestPaginationSerialization';

export class AllDevilsDto {
    __pagination?: RequestPaginationSerialization;
}
export class FilterDevilDto {
    @ApiPropertyOptional({ type: DevilRanksEnum })
    @IsOptional()
    @ValidateNested({ each: true })
    rank?: DevilRanksEnum | null;
}

export class SortDevilDto {
    @ApiProperty()
    @Type(() => String)
    @IsString()
    orderBy: keyof Devil;

    @ApiProperty()
    @IsString()
    order: string;
}

export class QueryDevilDto {
    @ApiPropertyOptional()
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    page?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (value ? Number(value) : 10))
    @IsNumber()
    @IsOptional()
    limit?: number;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @Transform(({ value }) =>
        value? plainToInstance(FilterDevilDto, JSON.parse(value)) : undefined
    )
    @ValidateNested()
    @Type(() => FilterDevilDto)
    filters?: FilterDevilDto | null;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @Transform(({ value }) => {
        return value
            ? plainToInstance(SortDevilDto, JSON.parse(value))
            : undefined;
    })
    @ValidateNested({ each: true })
    @Type(() => SortDevilDto)
    sort?: SortDevilDto[] | null;
}
