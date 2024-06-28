import { PickType } from '@nestjs/swagger';
import { SpellCreateDto } from './spell.create.dto';
export class SpellUpdateTypeDto extends PickType(SpellCreateDto, [
    'type',
] as const) {}
