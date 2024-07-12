import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ENUM_DEVIL_FLOOR } from '../constants/devil.floor.enum';
import { ENUM_DEVIL_RANK } from '../constants/devil.ranks.enum';

export class DevilGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Имя дьявола',
        example: faker.person.firstName(),
        required: true,
        nullable: false,
    })
    readonly name: string;

    @ApiProperty({
        description: 'Описание дьявола',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly description?: string;
    @ApiProperty({
        required: true,
        nullable: false,
        example: ENUM_DEVIL_FLOOR.ONE,
    })
    readonly floor: ENUM_DEVIL_FLOOR;
    @ApiProperty({
        required: true,
        nullable: false,
        example: ENUM_DEVIL_RANK.LOW,
    })
    readonly devilRank: ENUM_DEVIL_RANK;
    @ApiProperty({
        description: 'Тип магии у дьявола',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly magic_type: string;
}
