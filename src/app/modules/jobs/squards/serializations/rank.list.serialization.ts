import { OmitType } from '@nestjs/swagger';
import { RankGetSerialization } from './rank.get.serialization';
export class SquadRankForcesListSerialization extends OmitType(
    RankGetSerialization,
    [] as const
) {}
