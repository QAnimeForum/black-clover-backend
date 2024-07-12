import { PickType } from '@nestjs/swagger';
import { MineralCreateDto } from './mineral.create.dto';

export class MineralUpdateNameDto extends PickType(MineralCreateDto, [
    'name',
] as const) {}
