import { OmitType } from '@nestjs/swagger';
import { RaceGetSerialization } from './race.get.serialization';
export class RaceListSerialization extends OmitType(
    RaceGetSerialization,
    [] as const
) {}
