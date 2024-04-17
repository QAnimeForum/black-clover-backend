import { PickType } from '@nestjs/swagger';
import { SpellCreateDto } from './spell.create.dto';
export class SpellUpdateRangeDto extends PickType(SpellCreateDto, [
    'range',
] as const) {}
