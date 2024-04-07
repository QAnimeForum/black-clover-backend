import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('arrest')
export class ArrestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'timestamp',
    })
    time: Date;

    @Column({
        type: 'varchar',
    })
    reason: string;
}
