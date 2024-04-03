import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MineEntity } from './mine.enitity';

@Entity('mineral')
export class MineralEnity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @ManyToOne(() => MineEntity)
    @JoinColumn({
        name: 'mine_id',
        referencedColumnName: 'id',
    })
    mine: MineEntity;
}
