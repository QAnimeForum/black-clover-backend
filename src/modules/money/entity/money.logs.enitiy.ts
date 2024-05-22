import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
@Entity('money_log')
export class MoneyLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    sender: string;
    @Column({
        type: 'varchar',
    })
    recipient: string;
    @Column({
        type: 'int',
    })
    sum: number;

    @Column({
        type: 'varchar',
    })
    notes: string;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
