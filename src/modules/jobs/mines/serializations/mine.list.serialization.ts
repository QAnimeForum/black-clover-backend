import { OmitType } from '@nestjs/swagger';
import { MineGetSerialization } from './mine.get.serialization';

export class MineListSerialization extends OmitType(
    MineGetSerialization,
    [] as const
) {}
