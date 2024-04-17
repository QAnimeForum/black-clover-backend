import { PickType } from '@nestjs/swagger';
import { SpellCreateDto } from './spell.create.dto';
export class SpellUpdateDescriptionDto extends PickType(SpellCreateDto, [
    'description',
] as const) {}
