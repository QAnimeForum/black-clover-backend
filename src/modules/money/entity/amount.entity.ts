import { ArmedForcesRankEntity } from '../../squards/entity/armed.forces.rank.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('salary')
export class SalaryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    copper: number;

    @Column({
        type: 'int',
    })
    silver: number;
    @Column({
        type: 'int',
    })
    eclevtrum: number;
    @Column({
        type: 'int',
    })
    gold: number;

    @Column({
        type: 'int',
    })
    platinum: number;

    @OneToOne(() => ArmedForcesRankEntity)
    squadRank: ArmedForcesRankEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
