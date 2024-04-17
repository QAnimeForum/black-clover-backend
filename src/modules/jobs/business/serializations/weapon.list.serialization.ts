import { OmitType } from '@nestjs/swagger';
import { WeaponGetSerialization } from './weapon.get.serialization';

export class WeaponListSerialization extends OmitType(
    WeaponGetSerialization,
    [] as const
) {}
