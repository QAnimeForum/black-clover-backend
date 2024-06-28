import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class RaceGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Имя расы',
        example: faker.person.firstName(),
        required: true,
        nullable: false,
    })
    readonly name: string;

    @ApiProperty({
        description: 'Описание расы',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly description?: string;
}
