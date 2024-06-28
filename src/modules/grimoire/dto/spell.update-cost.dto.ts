import { PickType } from '@nestjs/swagger';
import { SpellCreateDto } from './spell.create.dto';
export class SpellUpdateCostDto extends PickType(SpellCreateDto, [
    'cost',
] as const) {}
