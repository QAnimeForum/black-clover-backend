import { Injectable } from '@nestjs/common';

import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { WalletEntity } from './entity/wallet.entity';
import { CashEntity } from './entity/cash.entity';
import { MoneyAddDto } from './dto/money-add.dto';
import { MoneyLogEntity } from './entity/money.logs.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(WalletEntity)
        private readonly walletRepository: Repository<WalletEntity>,
        @InjectRepository(MoneyLogEntity)
        private readonly moneyLogsRepository: Repository<MoneyLogEntity>,
        @InjectRepository(CashEntity)
        private readonly cashRepository: Repository<CashEntity>
    ) {}

    async addCharacterMoney(dto: MoneyAddDto) {
        this.connection.transaction(
            'READ UNCOMMITTED',
            async (transactionManager) => {
                const wallets: Array<WalletEntity> =
                    await transactionManager.query(
                        `select wallet.* from wallet JOIN character ON wallet.id = character.wallet_id JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = ${dto.tgId}`
                    );
                if (wallets.length !== 1) {
                    return;
                }
                const wallet: WalletEntity = wallets[0];
                wallet.copper += dto.copper;
                wallet.silver += dto.silver;
                wallet.gold += dto.gold;
                wallet.electrum += dto.electrum;
                wallet.platinum += dto.platinum;
                await transactionManager.update(
                    WalletEntity,
                    {
                        id: wallet.id,
                    },
                    {
                        copper: wallet.copper + dto.copper,
                        silver: wallet.silver + dto.silver,
                        gold: wallet.gold + dto.gold,
                        electrum: wallet.electrum + dto.electrum,
                        platinum: wallet.platinum + dto.platinum,
                    }
                );
                const moneyLogEntity = new MoneyLogEntity();
                moneyLogEntity.recipient = dto.tgId;
                moneyLogEntity.sender = `Начислил админ ${dto.adminId.toString()}`;
                moneyLogEntity.copper = dto.copper;
                moneyLogEntity.silver = dto.silver;
                moneyLogEntity.gold = dto.gold;
                moneyLogEntity.electrum = dto.electrum;
                moneyLogEntity.platinum = dto.platinum;
                moneyLogEntity.note = 'Начисление денег администратором';
                await transactionManager.save(moneyLogEntity);
            }
        );
    }
    async creeateWallet(transactionalEntityManager: EntityManager) {
        /*  const cashEntity = new CashEntity();
        cashEntity.copper = 0;
        cashEntity.silver = 0;
        cashEntity.electrum = 0;
        cashEntity.gold = 0;
        cashEntity.platinum = 0;
        await transactionalEntityManager.save(cashEntity);*/
        const wallet = new WalletEntity();
        wallet.copper = 0;
        wallet.silver = 0;
        wallet.electrum = 0;
        wallet.gold = 0;
        wallet.platinum = 0;
        await transactionalEntityManager.save(wallet);
        return wallet;
    }
    async findWalletById(id: string): Promise<WalletEntity> {
        const entity = await this.walletRepository.findOneBy({
            id: id,
        });
        return entity;
    }

    async findWalletByUserTgId(tgUserId: number): Promise<WalletEntity> {
        const wallets: Array<WalletEntity> = await this.walletRepository.query(
            `select wallet.* from wallet JOIN character ON wallet.id = character.wallet_id JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = ${tgUserId}`
        );
        if (wallets.length !== 1) {
            return;
        }
        return wallets[0];
    }

    async findAllTransactions() {
        return await this.moneyLogsRepository.find();
    }
}
