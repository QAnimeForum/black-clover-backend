import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SquadRankEntity } from '../../jobs/squards/entity/squad.rank.entity';

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

    @OneToOne(() => SquadRankEntity)
    squadRank: SquadRankEntity;
}
