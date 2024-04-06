import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MemberRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    member: string;
}
