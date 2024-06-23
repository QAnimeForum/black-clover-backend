import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EquipmentEntity } from '../entity/equipment.entity';
import { InventoryEntity } from '../entity/inventory.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { Inventory } from 'src/modules/character/domain/Inventory';
import { VehicleEntity } from '../entity/vehicle.entity';
@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,
        @InjectRepository(EquipmentEntity)
        private readonly equipomentRepository: Repository<EquipmentEntity>,
        @InjectRepository(EqupmentItemEntity)
        private readonly equipmentItemRepository: Repository<EqupmentItemEntity>,
        @InjectRepository(VehicleEntity)
        private readonly vehicleRepository: Repository<VehicleEntity>
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

    public async findAllEquipmentItems(query: PaginateQuery, tgUserId: string) {
        const inventoryId = await this.findInventoryByTgId(tgUserId);
        if (!inventoryId) {
            return null;
        }
        // const query: string = `select inventory.* from inventort JOIN character ON inventory.id = character.inventory JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = '${tgUserId}'`;
        //   const query: string = `select equipment_item.* from equipment_item JOIN inventory_equipment_items ON equipment_item.id = inventory_equipment_items.id`;

        return paginate(query, this.equipmentItemRepository, {
            sortableColumns: ['id', 'name', 'bodyPart'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name', 'bodyPart'],
            select: ['id', 'name', 'bodyPart'],
            filterableColumns: {
                bodyPart: true,
            },
        });
    }

    public async findAllVehicles(query: PaginateQuery, tgUserId: string) {
        const inventoryId = await this.findInventoryByTgId(tgUserId);
        if (!inventoryId) {
            return null;
        }
        // const query: string = `select inventory.* from inventort JOIN character ON inventory.id = character.inventory JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = '${tgUserId}'`;
        //   const query: string = `select equipment_item.* from equipment_item JOIN inventory_equipment_items ON equipment_item.id = inventory_equipment_items.id`;

        return paginate(query, this.vehicleRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                magicName: true,
            },
        });
    }
    async findEquipmentByTgId(tgUserId: string): Promise<EquipmentEntity> {
        const query: string = `select equipment.* from equipment JOIN character ON equipment.id = character.equipment_id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`;
        const equipments: Array<EquipmentEntity> =
            await this.equipomentRepository.query(query);
        if (equipments.length !== 1) {
            return;
        }
        return equipments[0];
    }

    async findInventoryByTgId(tgUserId: string): Promise<number> {
        const query: string = `select inventory.id from inventory JOIN character ON inventory.id = character.inventory_id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`;
        const inventories = await this.equipomentRepository.query(query);
        if (inventories.length !== 1) {
            return null;
        }
        return inventories[0].id;
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
