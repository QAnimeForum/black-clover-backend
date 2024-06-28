import { OmitType } from '@nestjs/swagger';
import { BusinessGetSerialization } from './business.get.serialization';
export class BusinessListSerialization extends OmitType(
    BusinessGetSerialization,
    [] as const
) {}
