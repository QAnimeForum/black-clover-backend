import { PickType } from '@nestjs/swagger';
import { DevilCreateDto } from './devil.create.dto';
export class DevilUpdateNameDto extends PickType(DevilCreateDto, [
    'name',
] as const) {}
