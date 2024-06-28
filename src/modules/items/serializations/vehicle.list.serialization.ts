import { OmitType } from '@nestjs/swagger';
import { VehicleGetSerialization } from './vehicle.get.serialization';

export class VehicleListSerialization extends OmitType(
    VehicleGetSerialization,
    [] as const
) {}
