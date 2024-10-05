import { PickType } from '@nestjs/swagger';
import { DevilCreateDto } from './devil.create.dto';
export class DevilUpdateDescriptionDto extends PickType(DevilCreateDto, [
    'description',
] as const) {}


