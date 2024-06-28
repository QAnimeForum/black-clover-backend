import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
export class RankGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Имя отряда',
        example: faker.person.firstName(),
        required: true,
        nullable: false,
    })
    readonly name: string;
}
