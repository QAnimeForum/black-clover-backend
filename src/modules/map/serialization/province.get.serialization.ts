import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ProvinceFormGetSerialization } from './province.form.get.serialization';
import { Type } from 'class-transformer';

export class ProvinceGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        type: ProvinceFormGetSerialization,
    })
    @Type(() => ProvinceFormGetSerialization)
    readonly form: ProvinceFormGetSerialization;

    @ApiProperty({
        description: 'Название страны',
        example: faker.location.country(),
        required: true,
        nullable: false,
    })
    readonly shortName: string;

    @ApiProperty({
        description: 'Полное название страны',
        example: faker.location.country(),
        required: true,
        nullable: false,
    })
    readonly fullName: string;
}
