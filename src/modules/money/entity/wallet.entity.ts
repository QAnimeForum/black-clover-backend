import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CashEntity } from './cash.entity';
import { BankAccountEntity } from './bank.account.entity';
import { CharacterEntity } from '../../character/entity/character.entity';
@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => CashEntity, (cash) => cash.wallet)
    @JoinColumn({ name: 'cash_id', referencedColumnName: 'id' })
    cash: CashEntity;

    @OneToOne(() => BankAccountEntity, (account) => account.wallet)
    @JoinColumn({ name: 'bank_account_id', referencedColumnName: 'id' })
    bankAccount: BankAccountEntity;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
