import { OmitType } from '@nestjs/swagger';
import { BurgGetSerialization } from './burg.get.serialization';

export class BurgListSerialization extends OmitType(
    BurgGetSerialization,
    [] as const
) {}
