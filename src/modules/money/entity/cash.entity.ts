import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Entity('cash')
export class CashEntity {
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

  /*  @OneToOne(() => WalletEntity, (wallet) => wallet.cash)
    wallet: WalletEntity;*/
}
