import { PickType } from '@nestjs/swagger';
import { MineralCreateDto } from './mineral.create.dto';

export class MineralUpdateDto extends PickType(MineralCreateDto, [
    'name',
    'description',
] as const) {}
