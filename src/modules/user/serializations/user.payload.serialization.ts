import { faker } from '@faker-js/faker';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { UserProfileSerialization } from './user.profile.serialization';
import { ENUM_POLICY_SUBJECT } from 'src/common/policy/constants/policy.enum.constant';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';
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
