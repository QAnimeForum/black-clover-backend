export class UserCreateDto {
   /* @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsUUID('4')
    readonly role: string;*/
    tgUserId: string;
}
