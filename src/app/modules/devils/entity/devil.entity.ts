import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { DevilFloorEnum } from '../constants/devil.floor.enum';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { DevilUnionEntity } from './devil.union.entity';

@Entity('devils')
export class DevilEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        unique: true,
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

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_10_id',
    })
    union_10: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_25_id',
    })
    union_25: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_50_id',
    })
    union_50: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_65_id',
    })
    union_65: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_80_id',
    })
    union_80: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_100_id',
    })
    union_100: DevilUnionEntity;
}
