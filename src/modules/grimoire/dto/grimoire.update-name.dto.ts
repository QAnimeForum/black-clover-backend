import { PickType } from '@nestjs/swagger';
import { GrimoireCreateDto } from './grimoire.create.dto';
export class GrimoireUpdateNameDto extends PickType(GrimoireCreateDto, [
    'magicName',
] as const) {}
