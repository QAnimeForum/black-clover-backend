import { ENUM_SPELL_TYPE } from '../constants/spell.type.enum';

export class SpellCreateDto {
    grimoireId?: string;
    name: string;
    description: string;
    damage: number;
    range: string;
    duration: string;
    cost: number;
    castTime: number;
    cooldown: number;
    type: ENUM_SPELL_TYPE;
    goals: string;
    minLevel: number;
    requipments: Array<string>;
}

/**
 *     range: string;
    duration: string;
    cost: string;
    castTime: string;
 */
