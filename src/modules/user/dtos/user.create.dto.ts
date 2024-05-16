import { CharacterEntity } from '../../character/entity/character.entity';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';

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
    role: ENUM_ROLE_TYPE;
}
