import { OmitType } from '@nestjs/swagger';
import { GearGetSerialization } from './gear.get.serialization';
export class GearListSerialization extends OmitType(
    GearGetSerialization,
    [] as const
) {}
