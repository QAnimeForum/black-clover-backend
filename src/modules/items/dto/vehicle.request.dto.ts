import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class VehicleRequestDto {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    vehicle: string;
}
