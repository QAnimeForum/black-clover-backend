import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { SquadRankEntity } from '../entity/squad.rank.entity';
export class SquadMemberGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Имя отряда',
        example: faker.person.firstName(),
        required: true,
        nullable: false,
    })
    readonly rank: SquadRankEntity;
}
