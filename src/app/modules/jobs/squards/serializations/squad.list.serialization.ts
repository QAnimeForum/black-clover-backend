import { OmitType } from '@nestjs/swagger';
import { SquadGetSerialization } from './squad.get.serialization';
export class SquadListSerialization extends OmitType(
    SquadGetSerialization,
    [] as const
) {}
