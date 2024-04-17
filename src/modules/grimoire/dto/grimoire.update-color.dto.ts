import { PickType } from '@nestjs/swagger';
import { GrimoireCreateDto } from './grimoire.create.dto';
export class GrimoireUpdateColorDto extends PickType(GrimoireCreateDto, [
    'magicColor',
] as const) {}
