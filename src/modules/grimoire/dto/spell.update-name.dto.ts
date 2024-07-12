import { PickType } from '@nestjs/swagger';
import { SpellCreateDto } from './spell.create.dto';
export class SpellUpdateNameDto extends PickType(SpellCreateDto, [
    'name',
] as const) {}
