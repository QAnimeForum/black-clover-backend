import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserGetSerialization } from './user.get.serialization';

export class UserProfileSerialization extends OmitType(UserGetSerialization, [
    'isActive',
] as const) {
    @ApiHideProperty()
    @Exclude()
    readonly isActive: boolean;
}
