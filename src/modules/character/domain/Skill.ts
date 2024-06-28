import { SkillProficiency } from '../constants/skill.proficiency.enum';
import { Ability } from './Ability';
import { Proficiency } from './Proficiency';

export class Skill {
    name: string;
    ability: Ability;
    proficiency: Proficiency;
    skillProficiency: SkillProficiency;
    extraBonus: number;
}
