import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';
@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    copper: number;
    @Column({
        type: 'int',
    })
    silver: number;
    @Column({
        type: 'int',
    })
    electrum: number;
    @Column({
        type: 'int',
    })
    gold: number;
    @Column({
        type: 'int',
    })
    platinum: number;

    @Column({
        name: 'use_platinum',
        type: 'bool',
    })
    usePlatinum: boolean;
    @Column({
        name: 'useElectrum',
        type: 'bool',
    })
    useElectrum: boolean;
    /*  @OneToOne(() => CashEntity, (cash) => cash.wallet)
    @JoinColumn({ name: 'cash_id', referencedColumnName: 'id' })
    cash: CashEntity;*/

    /*   @OneToOne(() => BankAccountEntity, (account) => account.wallet)
    @JoinColumn({ name: 'bank_account_id', referencedColumnName: 'id' })
    bankAccount: BankAccountEntity;*/

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
