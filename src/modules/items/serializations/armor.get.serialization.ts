import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class ArmorGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Название шахты',
        example: faker.lorem.word(),
        required: true,
        nullable: false,
    })
    readonly name: string;

    @ApiProperty({
        description: 'Описание шахты',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly description: string;
}
