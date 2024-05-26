import { PickType } from '@nestjs/swagger';
import { SpellCreateDto } from './spell.create.dto';
export class SpellCastTimeDto extends PickType(SpellCreateDto, [
    'castTime',
] as const) {}
