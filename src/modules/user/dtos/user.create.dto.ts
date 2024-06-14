import { CreatePlayableCharacterDto } from 'src/modules/character/dto/create-playable-character.dto';
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

    character: CreatePlayableCharacterDto;
    role: ENUM_ROLE_TYPE;
}
