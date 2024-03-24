import { DevilFloorEnum } from '../constants/devil.flor.enum';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';

export class Devil {
    id: number;
    name: string;
    description: string;
    floor: DevilFloorEnum;
    rank: DevilRanksEnum;
    magic_type: string;
}
