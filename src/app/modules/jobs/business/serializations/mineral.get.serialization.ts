import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class MineralGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Название минерала',
        example: faker.lorem.word(),
        required: true,
        nullable: false,
    })
    readonly name: string;

    @ApiProperty({
        description: 'Описание минерала',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly description: string;
}
