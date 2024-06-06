import { ENUM_SPELL_TYPE } from '../constants/spell.type.enum';

export class SpellCreateDto {
    grimoireId?: string;
    name: string;
    description: string;
    damage: number;
    range: string;
    duration: string;
    cost: number;
    castTime: string;
    cooldown: string;
    type: ENUM_SPELL_TYPE;
    goals: string;
    minLevel: number;
    requipments: string;
}

/**
 *     range: string;
    duration: string;
    cost: string;
    castTime: string;
 */
