import { DevilFloorEnum } from '../constants/devil.floor.enum';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';

export class Devil {
    id: string;
    name: string;
    description: string;
    floor: DevilFloorEnum;
    rank: DevilRanksEnum;
    magic_type: string;

    union_10: DevilUnion;
    union_25: DevilUnion;
    union_50: DevilUnion;
    union_65: DevilUnion;
    union_80: DevilUnion;
    union_100: DevilUnion;
}

export class DevilSpell {
    id: string;
    name: string;
    description: string;
    range: string;
    duration: string;
    cost: string;
    castTime: string;
    union: DevilUnion;
}

export class DevilUnion {
    id: string;
    spells: Array<DevilSpell>;
}
