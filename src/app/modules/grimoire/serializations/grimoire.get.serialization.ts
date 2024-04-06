import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { CardSymbolsEnum } from '../../character/constants/card.symbol.enum';

export class GrimoireGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Имя дьявола',
        example: faker.person.firstName(),
        required: true,
        nullable: false,
    })
    readonly magicName: string;

    @ApiProperty({
        description: 'Описание дьявола',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly description: string;
    @ApiProperty({
        required: true,
        nullable: false,
        example: CardSymbolsEnum.HEART,
    })
    readonly coverSymbol: CardSymbolsEnum;
    @ApiProperty({
        description: 'Тип магии у дьявола',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    readonly magicColor: string;
}
