import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SkillEntity } from './skill.entity';

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
    @OneToOne(() => SkillEntity)
    @JoinColumn({ name: 'skill_id' })
    skill: SkillEntity;
}
