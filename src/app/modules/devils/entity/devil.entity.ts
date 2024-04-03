import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { DevilFloorEnum } from '../constants/devil.flor.enum';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { DevilUnion } from './devil.union.entity';

@Entity('devils')
export class DevilEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        type: 'enum',
        enum: DevilFloorEnum,
        default: DevilFloorEnum.ONE,
        nullable: false,
    })
    floor: DevilFloorEnum;

    @Column({
        type: 'enum',
        enum: DevilRanksEnum,
        default: DevilRanksEnum.LOW,
    })
    rank: DevilRanksEnum;

    @Column({
        type: 'varchar',
    })
    magic_type: string;

    @OneToOne(() => DevilUnion)
    @JoinColumn({
        name: 'union_10_id',
    })
    union_10: DevilUnion;

    @OneToOne(() => DevilUnion)
    @JoinColumn({
        name: 'union_25_id',
    })
    union_25: DevilUnion;

    @OneToOne(() => DevilUnion)
    @JoinColumn({
        name: 'union_50_id',
    })
    union_50: DevilUnion;

    @OneToOne(() => DevilUnion)
    @JoinColumn({
        name: 'union_65_id',
    })
    union_65: DevilUnion;


    @OneToOne(() => DevilUnion)
    @JoinColumn({
        name: 'union_65_id',
    })
    union_80: DevilUnion;

    @OneToOne(() => DevilUnion)
    @JoinColumn({
        name: 'union_100_id',
    })
    union_100: DevilUnion;
}
