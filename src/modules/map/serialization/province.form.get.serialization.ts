import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class ProvinceFormGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Название города',
        example: faker.location.country(),
        required: true,
        nullable: false,
    })
    readonly name: string;

    @ApiProperty({
        description: 'Описание города',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly description?: string;
}
