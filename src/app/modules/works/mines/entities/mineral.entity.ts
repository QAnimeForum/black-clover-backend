import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
