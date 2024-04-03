import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wanted')
export class WantedEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    creator: string;
    @Column({
        type: 'varchar',
    })
    suspect: string;

    @Column({
        type: 'int',
    })
    priority: number;

    @Column({
        type: 'varchar',
    })
    reason: string;

    @Column({
        type: 'varchar',
    })
    createdAt: string;
}
