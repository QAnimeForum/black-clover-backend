import { Grimoire } from '../../grimoire/domain/Grimoire';
import { Inventory } from '../../inventory/domain/Inventory';
import { CharacterType } from '../constants/character.type.enum';
import { ArmorClass } from './ArmorClass';
import { Attack } from './Attack';
import { Background } from './Background';
import { CharacterAbilities } from './CharacterAbilities';
import { Note } from './Note';
import { PassiveSkill } from './PassiveSkill';
import { Proficiency } from './Proficiency';
import { Skill } from './Skill';
import { Speed } from './Speed';
import { Trait } from './Trait';

export class Character {
    id: string;
    type: CharacterType;
    notes: Note[];
    inventory: Inventory;
    features: Trait[];
}

export class CharacterCharacteristics {
    background: Background;

    level: number;
    maxHealth: number;
    //hitDie: { [key: string]: number } = {};

    /**
     * мастерство
     */
    charProficiency: Proficiency;
    fightingStyles?: string[];
    attacks: Attack[];
    abilities: CharacterAbilities;
    skills: Array<Skill>;
    passiveSkills: Array<PassiveSkill>;
    armorClasses: ArmorClass[];

    speeds: Speed[];

    grimoire: Grimoire;
}
