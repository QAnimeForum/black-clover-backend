import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { BankEntity } from './bank.entity';

@Entity('bank_account')
export class BankAccountEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    cooper: number;
    @Column({
        type: 'int',
    })
    silver: number;
    @Column({
        type: 'int',
    })
    eclevtrum: number;
    @Column({
        type: 'int',
    })
    gold: number;
    @Column({
        type: 'int',
    })
    platinum: number;

    @OneToOne(() => WalletEntity, (wallet) => wallet.bankAccount)
    wallet: WalletEntity;

    @ManyToOne(() => BankEntity, (bank) => bank.accounts)
    @JoinColumn({ name: 'bank_id', referencedColumnName: 'id' })
    bank: BankEntity;
}
