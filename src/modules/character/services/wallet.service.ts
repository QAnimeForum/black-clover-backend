import { Inject, Injectable } from '@nestjs/common';
s;
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { WalletEntity } from '../../money/entity/wallet.entity';
import { CashEntity } from '../../money/entity/cash.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectDataSource()
        @InjectRepository(WalletEntity)
        private readonly walletRepository: Repository<WalletEntity>,
        @InjectRepository(CashEntity)
        private readonly cashRepository: Repository<CashEntity>
    ) {}

    async creeateWallet(transactionalEntityManager: EntityManager) {
        const cashEntity = new CashEntity();
        cashEntity.cooper = 0;
        cashEntity.silver = 0;
        cashEntity.eclevtrum = 0;
        cashEntity.gold = 0;
        cashEntity.platinum = 0;
        await transactionalEntityManager.save(cashEntity);
        const wallet = new WalletEntity();
        wallet.cash = cashEntity;
        await transactionalEntityManager.save(wallet);
        return wallet;
    }
    async findWalletById(id: string): Promise<WalletEntity> {
        const entity = await this.walletRepository.findOneBy({
            id: id,
        });
        return entity;
    }

    async findGrimoireByUserTgId(tgUserId: string): Promise<GrimoireEntity> {
        const grimoire = await this.walletRepository
            .createQueryBuilder('wallet')
            .innerJoinAndSelect(
                'wallet.character',
                'charcter',
                'character.tgUserId = :tgUserId',
                { tgUserId: tgUserId }
            )
            .getOne();
        return grimoire;
        /**
      *  
      const entity = await this.userRepository.findOne({
          where: {
              tgUserId: tgUserId,
          },
          relations: {
              character: {
                  grimoire: true,
              },
          },
      });
      return entity.character.grimoire;*/
    }
}
