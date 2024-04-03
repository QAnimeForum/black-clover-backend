import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccountEntity } from './bank.account.enity';

@Entity('bank')
export class BankEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @OneToMany(() => BankAccountEntity, (account) => account.bank)
    accounts: Array<BankAccountEntity>;
}
