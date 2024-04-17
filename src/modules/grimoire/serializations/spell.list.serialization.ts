import { OmitType } from '@nestjs/swagger';
import { SpellGetSerialization } from './spell.get.serialization';

export class SpellListSerialization extends OmitType(
    SpellGetSerialization,
    [] as const
) {}
