import { ArmedForcesRankEntity } from '../../jobs/squards/entity/armed.forces.rank.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('salary')
export class SalaryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    cooper: number;

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
}
