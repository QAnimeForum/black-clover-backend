import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { BackgroundEnity } from './background.entity';
@Entity('race')
export class RaceEntity {
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

    @OneToMany(() => BackgroundEnity, (background) => background.race)
    backgrounds: BackgroundEnity[];
}
