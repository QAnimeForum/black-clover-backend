import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { RoleGetSerialization } from '../../role/serializations/role.get.serialization';

export class UserGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        type: RoleGetSerialization,
    })
    @Type(() => RoleGetSerialization)
    readonly role: RoleGetSerialization;
    @ApiProperty({
        required: true,
        nullable: false,
        example: true,
    })
    readonly isActive: boolean;
}
