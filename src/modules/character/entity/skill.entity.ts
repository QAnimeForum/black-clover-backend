import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AbilityEntity } from './ability.entity';
import { ProficiencyEntity } from './proficiency.entity';
import { SkillProficiency } from '../constants/skill.proficiency.enum';

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

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

}
