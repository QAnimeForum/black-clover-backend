import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RoleListSerialization } from '../../role/serializations/role.list.serialization';
import { UserProfileSerialization } from './user.profile.serialization';

export class UserListSerialization extends OmitType(UserProfileSerialization, [
    'role',
] as const) {
    @ApiProperty({
        type: RoleListSerialization,
        required: true,
        nullable: false,
    })
    @Type(() => RoleListSerialization)
    readonly role: RoleListSerialization;
}
