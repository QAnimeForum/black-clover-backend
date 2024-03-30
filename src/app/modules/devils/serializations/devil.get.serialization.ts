import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { DevilFloorEnum } from '../constants/devil.flor.enum';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';

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
        example: DevilFloorEnum.ONE,
    })
    readonly floor: DevilFloorEnum;
    @ApiProperty({
        required: true,
        nullable: false,
        example: DevilRanksEnum.LOW,
    })
    readonly devilRank: DevilRanksEnum;
    @ApiProperty({
        description: 'Тип магии у дьявола',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly magic_type: string;
}
