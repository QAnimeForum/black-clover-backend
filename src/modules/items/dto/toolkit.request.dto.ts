import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ToolKitRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    toolkit: string;
}
