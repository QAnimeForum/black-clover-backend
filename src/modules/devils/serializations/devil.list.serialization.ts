import { OmitType } from '@nestjs/swagger';
import { DevilGetSerialization } from './devil.get.serialization';

export class DevilListSerialization extends OmitType(
    DevilGetSerialization,
    [] as const
) {}
