import { OmitType } from '@nestjs/swagger';
import { ArmorGetSerialization } from './armor.get.serialization';

export class ArmorListSerialization extends OmitType(
    ArmorGetSerialization,
    [] as const
) {}
