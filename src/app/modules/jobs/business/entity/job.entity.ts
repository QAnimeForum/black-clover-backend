import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('job')
export class JobEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;
}
