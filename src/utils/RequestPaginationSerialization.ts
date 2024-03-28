import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
export enum ENUM_PAGINATION_ORDER_DIRECTION_TYPE {
    ASC = 'asc',
    DESC = 'desc',
}

export enum ENUM_PAGINATION_FILTER_CASE_OPTIONS {
    UPPERCASE = 'UPPERCASE',
    LOWERCASE = 'LOWERCASE',
}

export enum ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS {
    START_OF_DAY = 'START_OF_DAY',
    END_OF_DAY = 'END_OF_DAY',
}

export class RequestPaginationSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        example: faker.person.fullName(),
    })
    search: string;

    @ApiProperty({
        required: true,
        nullable: false,
        example: {},
    })
    filters: Record<
        string,
        string | number | boolean | Array<string | number | boolean>
    >;

    @ApiProperty({
        required: true,
        nullable: false,
        example: 1,
    })
    page: number;

    @ApiProperty({
        required: true,
        nullable: false,
        example: 20,
    })
    perPage: number;

    @ApiProperty({
        required: true,
        nullable: false,
        example: 'createdAt',
    })
    orderBy: string;

    @ApiProperty({
        required: true,
        nullable: false,
        example: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
    })
    orderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;

    @ApiProperty({
        required: true,
        nullable: false,
        example: ['name'],
    })
    availableSearch: string[];

    @ApiProperty({
        required: true,
        nullable: false,
        example: ['name', 'createdAt'],
    })
    availableOrderBy: string[];

    @ApiProperty({
        required: true,
        nullable: false,
        example: Object.values(ENUM_PAGINATION_ORDER_DIRECTION_TYPE),
    })
    availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];
}
