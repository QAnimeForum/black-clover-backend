import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class UserGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        example: true,
    })
    readonly isActive: boolean;
}
