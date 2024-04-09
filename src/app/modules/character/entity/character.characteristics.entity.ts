import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from './character.entity';
import { AbilityEntity } from './ability.entity';
import { ArmorClassEntity } from './armor.class.entity';
import { SpeedEntity } from './speed.entity';
import { ProficiencyEntity } from './proficiency.entity';
@Entity('сharacter_сharacteristics')
export class CharacterCharacteristicsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    experience: number;
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

    @Column({
        type: 'int',
    })
    hunger: number;

    @Column({
        type: 'int',
    })
    sanity: number;
    @OneToOne(() => ProficiencyEntity, {
        cascade: true,
    })
    @JoinColumn({ name: 'proficiency_id' })
    proficiency: ProficiencyEntity;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;

    /* @OneToMany(
        () => AbilityEntity,
        (ability) => ability.characterCharacteristics
    )
    abilites: AbilityEntity[];*/

    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'strength_id',
        referencedColumnName: 'id',
    })
    strength: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'dexterity_id',
        referencedColumnName: 'id',
    })
    dexterity: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'constitution_id',
        referencedColumnName: 'id',
    })
    constitution: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'intelligence_id',
        referencedColumnName: 'id',
    })
    intelligence: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'wisdom_id',
        referencedColumnName: 'id',
    })
    wisdom: AbilityEntity;
    @OneToOne(() => AbilityEntity)
    @JoinColumn({
        name: 'charisma_id',
        referencedColumnName: 'id',
    })
    charisma: AbilityEntity;

    @OneToOne(() => ArmorClassEntity)
    @JoinColumn({
        name: 'armor_class_id',
        referencedColumnName: 'id',
    })
    armorClass: ArmorClassEntity;

    @OneToMany(() => SpeedEntity, (speed) => speed.characterCharacteristics)
    speeds: SpeedEntity[];
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
