import { PickType } from '@nestjs/swagger';
import { SpellCreateDto } from './spell.create.dto';
export class SpellUpdateGoalsDto extends PickType(SpellCreateDto, [
    'goals',
] as const) {}
