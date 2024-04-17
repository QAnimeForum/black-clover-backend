import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
}
