import { CharacterEntity } from '../../character/entity/character.entity';

export class UserCreateDto {
    /* @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsUUID('4')
    readonly role: string;*/
    tgUserId: string;

    character: CharacterEntity;
}
