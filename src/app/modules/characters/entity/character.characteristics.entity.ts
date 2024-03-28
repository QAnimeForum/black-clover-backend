import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from './character.entity';
import { SkillProficiency } from '../constants/skill.proficiency.enum';
import { ArmorEntity } from './armor.entity';
@Entity('сharacter_сharacteristics')
export class CharacterCharacteristicsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
        name: 'current_level',
    })
    currentLevel: number;

    @Column({
        type: 'int',
        name: 'max_level',
    })
    maxLevel: number;

    @Column({
        type: 'int',
    })
    currentHealth: number;

    @Column({
        type: 'int',
    })
    maxHealth: number;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;

    @OneToMany(
        () => AbilityEntity,
        (ability) => ability.characterCharacteristics
    )
    abilites: AbilityEntity[];

    @OneToMany(
        () => ArmorClassEntity,
        (armor) => armor.characterCharacteristics
    )
    armorClasses: ArmorClassEntity[];

    @OneToMany(() => SpeedEntity, (speed) => speed.characterCharacteristics)
    speeds: SpeedEntity[];
}

@Entity('proficiency')
export class ProficiencyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    level: number;

    @Column({
        type: 'int',
    })
    extraBonus: number;
}

/*
@Entity('character_abilities')
export class CharacterAbilitiesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'strength_id',
    })
    strength: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'dexterity_id',
    })
    dexterity: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'constitution_id',
    })
    constitution: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'intelligence_id',
    })
    intelligence: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'wisdom_id',
    })
    wisdom: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'charisma_id',
    })
    charisma: AbilityEntity;
}*/

@Entity('ability')
export class AbilityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    abbr: string;
    @Column({
        type: 'int',
    })
    score: number;

    @Column({
        type: 'int',
    })
    modifier: number;

    @ManyToOne(
        () => CharacterCharacteristicsEntity,
        (characterCharacteristics) => characterCharacteristics.speeds
    )
    characterCharacteristics: CharacterCharacteristicsEntity;
}

@Entity('skill')
export class SkillEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'ability_id',
    })
    ability: AbilityEntity;
    @OneToOne(() => ProficiencyEntity)
    @JoinColumn({
        name: 'proficiency_id',
    })
    proficiency: ProficiencyEntity;

    @Column({
        type: 'enum',
        enum: SkillProficiency,
        default: SkillProficiency.FULL,
    })
    skillProficiency: SkillProficiency;
    @Column({
        type: 'int',
    })
    extraBonus: number;
}
@Entity('passive_skill')
export class PassiveSkillEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'int',
    })
    base: number;
    skill: SkillEntity;
}

@Entity('armor_class')
export class ArmorClassEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'int',
    })
    base: number;
 //  modifier: Array<number>;
    @Column({
        type: 'int',
    })
    bonus: number;
    @ManyToOne(
        () => CharacterCharacteristicsEntity,
        (characterCharacteristics) => characterCharacteristics.speeds
    )
    characterCharacteristics: CharacterCharacteristicsEntity;
    @OneToOne(() => ArmorEntity)
    armor: ArmorEntity;
}
/**
 * import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArmorEntity } from './armor.entity';

@Entity('armor_class')
export class ArmorClassEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;
    @Column({
        type: 'int',
    })
    base: number;
    @Column({
        type: 'int',
    })
    modifier: number;
    @Column({
        type: 'int',
    })
    bonus: number;

    @OneToOne(() => ArmorEntity)
    armor: ArmorEntity;
}

 */
@Entity('speed')
export class SpeedEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'int',
    })
    base: number;
    @Column({
        type: 'int',
    })
    bonus: number;

    @ManyToOne(
        () => CharacterCharacteristicsEntity,
        (characterCharacteristics) => characterCharacteristics.speeds
    )
    characterCharacteristics: CharacterCharacteristicsEntity;
}

/**
 * import { ArmorClass } from './ArmorClass';
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

    charProficiency: Proficiency;
    fightingStyles?: string[];
    attacks: Attack[];
    abilities: CharacterAbilities;
    skills: Array<Skill>;
    passiveSkills: Array<PassiveSkill>;
    armorClasses: ArmorClass[];

    speeds: Speed[];
}

 */
