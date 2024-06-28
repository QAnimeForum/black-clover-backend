import { PickType } from '@nestjs/swagger';
import { MineCreateDto } from './mine.create.dto';

export class MineUpdateDto extends PickType(MineCreateDto, [
    'name',
    'description',
] as const) {}
