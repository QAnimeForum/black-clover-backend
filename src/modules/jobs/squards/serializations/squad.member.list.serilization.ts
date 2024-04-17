import { OmitType } from '@nestjs/swagger';
import { SquadMemberGetSerialization } from './squad.member.get.serialization';
export class SquadMemberListSerialization extends OmitType(
    SquadMemberGetSerialization,
    [] as const
) {}
