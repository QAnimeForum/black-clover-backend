import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EquipmentEntity } from '../entity/equipment.entity';
import { InventoryEntity } from '../entity/inventory.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { EqupmentItemEntity } from '../entity/equpment.item.entity';
@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,
        @InjectRepository(EquipmentEntity)
        private readonly equipomentRepository: Repository<EquipmentEntity>,
        @InjectRepository(EqupmentItemEntity)
        private readonly equipmentItem: Repository<EqupmentItemEntity>
    ) {}

    async createInventory(transactionalEntityManager: EntityManager) {
        const inventory = new InventoryEntity();
        transactionalEntityManager.save(inventory);
        return inventory;
    }
    async findInventoryByCharacterId(
        characterId: string
    ): Promise<InventoryEntity> {
        return await this.inventoryRepository
            .createQueryBuilder('background')
            .innerJoinAndSelect(
                'inventory.character',
                'charcter',
                'character.id = :characterId',
                { characterId: characterId }
            )
            .getOne();
    }

    public findAllEquipmentItems(paginateQuery: PaginateQuery, tgUserId: string) {

       // const query: string = `select inventory.* from inventort JOIN character ON inventory.id = character.inventory JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = '${tgUserId}'`;
    //   const query: string = `select equipment_item.* from equipment_item JOIN inventory_equipment_items ON equipment_item.id = inventory_equipment_items.id`;
      return [];
    /**
 * 
        return paginate(query, this.inventoryRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['magicName', 'DESC']],
            searchableColumns: ['coverSymbol', 'magicName', 'status'],
            select: [
                'id',
                'coverSymbol',
                'magicName',
                'coverImagePath',
                'status',
            ],
            filterableColumns: {
                magicName: true,
            },
        });
 */
    }
    async findEquipmentByTgId(tgUserId: string): Promise<EquipmentEntity> {
        const query: string = `select equipment.* from equipment JOIN character ON equipment.id = character.equipment_id JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = '${tgUserId}'`;
        const equipments: Array<EquipmentEntity> =
            await this.equipomentRepository.query(query);
        if (equipments.length !== 1) {
            return;
        }
        return equipments[0];
    }

    async findInventoryByTgId(tgUserId: string): Promise<EquipmentEntity> {
        const query: string = `select inventory.* from inventort JOIN character ON inventory.id = character.inventory JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = '${tgUserId}'`;
        const equipments: Array<EquipmentEntity> =
            await this.equipomentRepository.query(query);
        if (equipments.length !== 1) {
            return;
        }
        return equipments[0];
    }

    /**
    *  async findInventoryByTgId(userTgId: string): Promise<InventoryEntity> {
        const query: string = `select inventory.* from wallet JOIN character ON wallet.id = character.wallet_id JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = ${tgUserId}`;
        const wallets: Array<WalletEntity> =
            await this.walletRepository.query(query);
        if (wallets.length !== 1) {
            return;
        }
        return wallets[0];
    }
    */
}
