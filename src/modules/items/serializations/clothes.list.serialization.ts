import { OmitType } from '@nestjs/swagger';
import { BusinessGetSerialization } from './business.get.serialization';
export class ClothesListSerialization extends OmitType(
    BusinessGetSerialization,
    [] as const
) {}
