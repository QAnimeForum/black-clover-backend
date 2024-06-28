import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ArmedForcesRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    armedForcesId: string;

    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    characterId: string;

    @Type(() => String)
    tgUserId: string;
    @Type(() => String)
    tgUsername: string;
}
