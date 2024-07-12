import { OmitType } from '@nestjs/swagger';
import { GrimoireGetSerialization } from './grimoire.get.serialization';

export class GrimoireListSerialization extends OmitType(
    GrimoireGetSerialization,
    [] as const
) {}
