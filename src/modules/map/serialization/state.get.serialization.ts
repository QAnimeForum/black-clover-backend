import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { StateFormGetSerialization } from './state.form.get.serialization';
import { Type } from 'class-transformer';

export class StateGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Название страны',
        example: faker.location.country(),
        required: true,
        nullable: false,
    })
    readonly name: string;

    @ApiProperty({
        description: 'Полное название страны',
        example: faker.location.country(),
        required: true,
        nullable: false,
    })
    readonly fullName: string;

    @ApiProperty({
        description: 'Описание страны',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly description?: string;

    @ApiProperty({
        required: true,
        nullable: false,
        type: StateFormGetSerialization,
    })
    @Type(() => StateFormGetSerialization)
    readonly form: StateFormGetSerialization;
}
