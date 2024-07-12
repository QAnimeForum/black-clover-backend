import { PickType } from '@nestjs/swagger';
import { MineralCreateDto } from './mineral.create.dto';

export class MineralUpdateDescriptionDto extends PickType(MineralCreateDto, [
    'description',
] as const) {}
