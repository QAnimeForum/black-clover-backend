import { ArmorClass } from './ArmorClass';
import { Attack } from './Attack';
import { CharacterAbilities } from './CharacterAbilities';
import { PassiveSkill } from './PassiveSkill';
import { Proficiency } from './Proficiency';
import { Skill } from './Skill';
import { Speed } from './Speed';
export class CharacterCharacteristics {
    level: number;
    maxHealth: number;
    //hitDie: { [key: string]: number } = {};

    /**
     * мастерство
     */
    charProficiency: Proficiency;

    abilities: CharacterAbilities;
    skills: Array<Skill>;
    passiveSkills: Array<PassiveSkill>;
    armorClasses: ArmorClass[];

    speeds: Speed[];
}


/**
 *    fightingStyles?: string[];
    attacks: Attack[];
 */