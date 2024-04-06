import { PickType } from '@nestjs/swagger';
import { MineCreateDto } from './mine.create.dto';

export class MineUpdateDescriptionDto extends PickType(MineCreateDto, [
    'description',
] as const) {}
