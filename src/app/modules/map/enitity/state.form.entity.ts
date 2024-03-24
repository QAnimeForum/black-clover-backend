import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    @OneToOne(() => StateEntity, (state) => state.form)
    state: StateFormEntity;
}
