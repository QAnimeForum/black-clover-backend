import { Injectable } from '@nestjs/common';

import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { WalletEntity } from './entity/wallet.entity';

import { MoneyAddDto } from './dto/money-add.dto';
import { MoneyLogEntity } from './entity/money.logs.entity';
import { MoneyDto } from './dto/money.dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(WalletEntity)
        private readonly walletRepository: Repository<WalletEntity>,
        @InjectRepository(MoneyLogEntity)
        private readonly moneyLogsRepository: Repository<MoneyLogEntity>,
    ) {}

    async addCharacterMoney(dto: MoneyAddDto) {
        this.connection.transaction(
            'READ UNCOMMITTED',
            async (transactionManager) => {
                const wallets: Array<WalletEntity> =
                    await transactionManager.query(
                        `select wallet.* from wallet JOIN character ON wallet.id = character.wallet_id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${dto.tgId}'`
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
                moneyLogEntity.recipient = dto.tgId.toString();
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

    convertMoney(walletId: string) {
        this.connection.transaction(
            'READ UNCOMMITTED',
            async (transactionManager) => {
                const wallet = await this.findWalletById(walletId);
                const moneyDto = new MoneyDto();
                const totalCopper =
                    wallet.copper +
                    wallet.silver * 10 +
                    wallet.electrum * 50 +
                    wallet.gold * 100 +
                    wallet.platinum * 1000;
                let leftover = 0;
                if (wallet.usePlatinum) {
                    const platinum = Math.floor(totalCopper / 1000);
                    leftover = totalCopper % 1000;
                    moneyDto.platinum = platinum;
                } else {
                    leftover = totalCopper;
                    moneyDto.platinum = 0;
                }

                const gold = Math.floor(leftover / 100);
                leftover = leftover % 100;
                if (wallet.useElectrum) {
                    const electrum = Math.floor(gold / 50);
                    leftover = gold % 50;
                    moneyDto.electrum = electrum;
                } else {
                    moneyDto.electrum = 0;
                }
                const silver = Math.floor(leftover / 100);
                const copper = leftover % 10;
                moneyDto.gold = gold;
                moneyDto.silver = silver;
                moneyDto.copper = copper;
                const moneyLogEntity1 = new MoneyLogEntity();
                moneyLogEntity1.recipient = `Кошелёк ${wallet.id}`;
                moneyLogEntity1.sender = `Нет`;
                moneyLogEntity1.copper = wallet.copper;
                moneyLogEntity1.silver = wallet.silver;
                moneyLogEntity1.gold = wallet.gold;
                moneyLogEntity1.electrum = wallet.electrum;
                moneyLogEntity1.platinum = wallet.platinum;
                moneyLogEntity1.note = 'Конвертация валюты. Произошла в меню кошелька. Старая сумма.';
                await transactionManager.save(moneyLogEntity1);
                await transactionManager.update(
                    WalletEntity,
                    {
                        id: wallet.id,
                    },
                    {
                        copper: moneyDto.copper,
                        silver: moneyDto.silver,
                        gold: moneyDto.gold,
                        electrum: moneyDto.electrum,
                        platinum: moneyDto.platinum,
                    }
                );
                const moneyLogEntity2 = new MoneyLogEntity();
                moneyLogEntity2.recipient = `Кошелёк ${wallet.id}`;
                moneyLogEntity2.sender = `Нет`;
                moneyLogEntity2.copper = moneyDto.copper;
                moneyLogEntity2.silver = moneyDto.silver;
                moneyLogEntity2.gold = moneyDto.gold;
                moneyLogEntity2.electrum = moneyDto.electrum;
                moneyLogEntity2.platinum = moneyDto.platinum;
                moneyLogEntity2.note = 'Конвертация валюты. Произошла в меню кошелька. Новая сумма.';
                await transactionManager.save(moneyLogEntity2);
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
        wallet.useElectrum = false;
        wallet.usePlatinum = false;
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
        const query: string = `select wallet.* from wallet JOIN character ON wallet.id = character.wallet_id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`;
        const wallets: Array<WalletEntity> =
            await this.walletRepository.query(query);
        if (wallets.length !== 1) {
            return;
        }
        return wallets[0];
    }

    async findAllTransactions() {
        return await this.moneyLogsRepository.find();
    }
}
