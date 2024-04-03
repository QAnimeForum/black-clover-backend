import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { CharacterEntity } from '../../characters/entity/character.entity';
import { CashEntity } from './cash.entity';
import { BankAccountEntity } from './bank.account.enity';
@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => CashEntity)
    @JoinColumn({ name: 'cash_id', referencedColumnName: 'id' })
    cash: CashEntity;

    @OneToOne(() => BankAccountEntity)
    @JoinColumn({ name: 'bank_account_id', referencedColumnName: 'id' })
    bankAccount: BankAccountEntity;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;
}
