import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class UserCreateDto {
    @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsUUID('4')
    readonly role: string;
}
