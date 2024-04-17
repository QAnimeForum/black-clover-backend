import { AttachedFeature } from './AttachedFeature';

export class Attack {
    name: string;
    attackBonus: AttackBonus;
    dice: string;
    damageType: string;
    damageBonus: number;
    fightingStyles?: AttachedFeature[];
}

export class AttackBonus {
    ability: number;
    proficient: boolean;
    itemBonus: number;
}
