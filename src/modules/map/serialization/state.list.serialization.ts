import { OmitType } from '@nestjs/swagger';
import { StateGetSerialization } from './state.get.serialization';

export class StateListSerialization extends OmitType(
    StateGetSerialization,
    [] as const
) {}
