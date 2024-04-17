import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StateEntity } from './state.entity';

@Entity('stateform')
export class StateFormEntity {
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

    @OneToMany(() => StateEntity, (state) => state.form)
    states: StateEntity[];
}
