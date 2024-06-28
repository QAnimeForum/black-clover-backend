import { OmitType } from '@nestjs/swagger';
import { HouseGetSerialization } from './house.get.serialization';
export class HouseListSerialization extends OmitType(
    HouseGetSerialization,
    [] as const
) {}
