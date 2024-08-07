import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SquadMemberRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    member: string;
}
