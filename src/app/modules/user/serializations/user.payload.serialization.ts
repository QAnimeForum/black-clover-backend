import { faker } from '@faker-js/faker';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ENUM_POLICY_SUBJECT } from '../../policy/constants/policy.enum.constant';
import { ENUM_ROLE_TYPE } from '../../role/constants/role.enum.constant';
import { UserProfileSerialization } from './user.profile.serialization';
export class UserPayloadPermissionSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        enum: ENUM_POLICY_SUBJECT,
        example: ENUM_POLICY_SUBJECT.API_KEY,
    })
    subject: ENUM_POLICY_SUBJECT;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    action: string;
}

export class UserPayloadSerialization extends OmitType(
    UserProfileSerialization,
    ['role'] as const
) {
    @ApiProperty({
        example: [faker.string.uuid()],
        type: 'string',
        isArray: true,
        required: true,
        nullable: false,
    })
    @Transform(({ obj }) => `${obj.role._id}`)
    readonly role: string;

    @ApiProperty({
        example: ENUM_ROLE_TYPE.ADMIN,
        type: 'string',
        enum: ENUM_ROLE_TYPE,
        required: true,
        nullable: false,
    })
    @Expose()
    @Transform(({ obj }) => obj.role.type)
    readonly type: ENUM_ROLE_TYPE;
    /*
    @ApiProperty({
        type: UserPayloadPermissionSerialization,
        isArray: true,
        required: true,
        nullable: false,
    })
    @Transform(({ obj }) => {
        return obj.role.permissions.map(({ action, subject }: IPolicyRule) => {
            const ac = action.map(
                (l) => ENUM_POLICY_REQUEST_ACTION[l.toUpperCase()]
            );
            return {
                subject,
                action: ac.join(','),
            };
        });
    })
    @Expose()
    readonly permissions: UserPayloadPermissionSerialization[];*/
}
