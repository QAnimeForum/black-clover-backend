export class Spell {
    name: string;
    description: string;
    castTime: string;
    range: string;
    concentration: boolean;
    duration: string;
    minimumLevel: string;
}

/**
 * 
 * export class Spell {
    name: string;
    description: string;
    school: string;
    castTime: string;
    range: string;
    concentration: boolean;
    duration: string;
    components: string[];
    material: string;
    minimumLevel: string;
    ritual: boolean;
    spellAttack: boolean;

    spellcastingAbility: string;
    source?: AttachedFeature;
}

export class SpellSlot {
    level: number;
    resourceMax?: number;
    proficiency?: boolean;
}

export interface SpellcastingAbility {
    title: string;
    preparedSpells: {
        level: number;
        modifier: number;
    };
    spellSave: {
        base: number;
        proficiency: number;
        modifier: number;
    };
    spellAttack: {
        proficiency: number;
        modifier: number;
    };
}

 */