import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
export class SpellGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Имя дьявола',
        example: faker.person.firstName(),
        required: true,
        nullable: false,
    })
    readonly name: string;

    @ApiProperty({
        description: '',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly description: string;

    @ApiProperty({
        description: '',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    range: string;
    @ApiProperty({
        description: '',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    duration: string;
    @ApiProperty({
        description: '',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    cost: string;
    @ApiProperty({
        description: '',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    castTime: string;
}
