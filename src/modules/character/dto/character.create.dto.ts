import { ENUM_CHARCACTER_TYPE } from '../constants/character.type.enum';

export class CharacterCreateDto {
    name?: string;
    type?: ENUM_CHARCACTER_TYPE;
    age?: number;
    sex?: string;
    stateId?: string;
    stateName?: string;
    raceId?: string;
    raceName?: string;
    magic?: string;
    height?: number;
    maxHealth?: number;
    currentLevel?: 1;
    experience?: number;
    maxLevel?: number;
    proficiency?: {
        level?: number;
        extraBonus?: number;
    };
    armorClass?: {
        base?: number;
        bonus?: number;
    };
    abilities?: {
        strength?: {
            score?: number;
            modifier?: number;
        };
        dexterity?: {
            score?: number;
            modifier?: number;
        };
        constitution?: {
            score?: number;
            modifier?: number;
        };

        intelligence?: {
            score?: number;
            modifier?: number;
        };
        wisdom?: {
            score?: number;
            modifier?: number;
        };
        charisma?: {
            score?: number;
            modifier?: number;
        };
    };
    cash?: {
        copper?: number;
        silver?: number;
        eclevtrum?: number;
        gold?: number;
        platinum?: number;
    };
}
