import { OmitType } from '@nestjs/swagger';
import { ProvinceGetSerialization } from './province.get.serialization';

export class ProvinceListSerialization extends OmitType(
    ProvinceGetSerialization,
    [] as const
) {}
