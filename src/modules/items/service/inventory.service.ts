import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { EquipmentEntity } from '../entity/equipment.entity';
import {
    InventoryEntity,
    InventoryEqipmentItemsEntity,
} from '../entity/inventory.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { Inventory } from 'src/modules/character/domain/Inventory';
import { VehicleEntity } from '../entity/vehicle.entity';
import { ENUM_BODY_PART_ENUM } from '../constants/body.part.enum';
import { EqupmentItemService } from './equipment.item.service';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
@Injectable()
export class InventoryService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        private readonly equipmentItemService: EqupmentItemService,
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,
        @InjectRepository(CharacterEntity)
        private readonly characterRepostiry: Repository<CharacterEntity>,
        @InjectRepository(EquipmentEntity)
        private readonly equipomentRepository: Repository<EquipmentEntity>,
        @InjectRepository(InventoryEqipmentItemsEntity)
        private readonly invetororyEquipmentItemsRepository: Repository<InventoryEqipmentItemsEntity>,
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

    public async findAllEquipmentItems(query: PaginateQuery) {
        return paginate(query, this.invetororyEquipmentItemsRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: [
                'id',
                'inventory',
                'inventory.id',
                'equpmentItem',
                'equpmentItem.id',
                'equpmentItem.name',
                'equpmentItem.bodyPart',
            ],
            select: [
                'id',
                'inventory',
                'inventory.id',
                'equpmentItem',
                'equpmentItem.id',
                'equpmentItem.name',
                'equpmentItem.bodyPart',
            ],
            relations: ['inventory', 'equpmentItem'],
            filterableColumns: {
                'equpmentItem.bodyPart': true,
                inventory_id: true,
            },
        });
        /*   await paginate<InventoryEntity>(query, queryBuilder, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['name', 'bodyPart'],
            select: ['id', 'name', 'bodyPart'],
            filterableColumns: {
                bodyPart: true,
                inventoryId: true,
            },
        });*/
    }

    public async findAllVehicles(query: PaginateQuery) {
        return paginate(query, this.vehicleRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                inventoryId: true,
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

    async findInventoryIdByTgId(tgUserId: string) {
        const character = await this.characterRepostiry.findOne({
            where: {
                user: {
                    tgUserId: tgUserId,
                },
            },
            relations: {
                inventory: true,
            },
        });
        return character.inventory;
    }

    async findInventoryByTgId(tgUserId: string): Promise<string> {
        const query: string = `select inventory.* from inventory JOIN character ON inventory.id = character.inventory_id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`;
        const inventories = await this.equipomentRepository.query(query);
        if (inventories.length !== 1) {
            return null;
        }
        return inventories[0].id;
    }

    async addItemToInventory(
        characterId: string,
        itemId: string
    ): Promise<void> {
        const inventory = await this.findInventoryByCharacterId(characterId);
        await this.connection
            .createQueryBuilder()
            .relation(InventoryEntity, 'items')
            .of(inventory)
            .add(itemId);
    }
    /*
    async deleteItemFromInventory(characterId: string, itemId: string) {
        const inventory = await this.findInventoryByCharacterId(characterId);
        inventory.items = inventory.items.filter((item) => {
            return item.id !== itemId;
        });
        await this.connection.manager.save(inventory);
    }

    async getItemFromInventoryWithSlot(
        characterId: string,
        bodyPart: ENUM_BODY_PART_ENUM
    ): Promise<EqupmentItemEntity[]> {
        const inventory = await this.findInventoryByCharacterId(characterId);
        const items = inventory.items;
        const result = [];

        for (const item of items) {
            if (
                (await this.equipmentItemService.getItemSlot(item.id)) ===
                bodyPart
            ) {
                result.push(
                    await this.equipmentItemService.findItemById(inventory.id)
                );
            }
        }
        return result;
    }

    async getInventoryWithSlot(
        characterId: string,
        bodyPart: ENUM_BODY_PART_ENUM
    ): Promise<EqupmentItemEntity[]> {
        const inventory = await this.findInventoryByCharacterId(characterId);
        const items = inventory.items;
        const result = [];
        for (const inventory of result) {
            if (
                (await this.equipmentItemService.getItemSlot(
                    inventory.item_id
                )) === bodyPart
            ) {
                items.push(inventory);
            }
        }
        return items;
    }*/
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
