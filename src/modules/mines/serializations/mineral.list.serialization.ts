import { OmitType } from '@nestjs/swagger';
import { MineralGetSerialization } from './mineral.get.serialization';

export class MineralListSerialization extends OmitType(
    MineralGetSerialization,
    [] as const
) {}
