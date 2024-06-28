import { OmitType } from '@nestjs/swagger';
import { ArmedForcesGetSerialization } from './armed.forces.get.serialization';
export class ArmedForcesListSerialization extends OmitType(
    ArmedForcesGetSerialization,
    [] as const
) {}
