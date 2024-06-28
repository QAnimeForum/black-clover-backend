import { PickType } from '@nestjs/swagger';
import { SpellCreateDto } from './spell.create.dto';
export class SpellUpdateDurationDto extends PickType(SpellCreateDto, [
    'duration',
] as const) {}
