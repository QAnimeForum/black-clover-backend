import { OmitType } from '@nestjs/swagger';
import { ToolkitGetSerialization } from './toolkit.get.serialization';
export class ToolkitListSerialization extends OmitType(
    ToolkitGetSerialization,
    [] as const
) {}
