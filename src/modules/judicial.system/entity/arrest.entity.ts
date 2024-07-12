import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
