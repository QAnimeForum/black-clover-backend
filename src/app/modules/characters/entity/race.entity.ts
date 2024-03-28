import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
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

    @OneToOne(() => BackgroundEnity, (background) => background.race)
    background: BackgroundEnity;
}
