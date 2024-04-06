import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BackgroundEnity } from '../../character/entity/background.entity';
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
