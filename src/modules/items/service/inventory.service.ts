import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { EquipmentEntity } from '../entity/equipment.entity';
import { InventoryEntity } from '../entity/inventory.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { VehicleEntity } from '../entity/vehicle.entity';
import { EqupmentItemService } from './equipment.item.service';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { InventoryEqipmentItemsEntity } from '../entity/inventory.eqipmentItems.entity';
import { ENUM_BODY_PART_ENUM } from '../constants/body.part.enum';
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
        const query1 = await this.connection
            .query(`select equpment_item.id, equpment_item.name,  count(*) as count
from inventory_equipment_items
join equpment_item on equpment_item.id = inventory_equipment_items.equpment_item_id
where inventory_equipment_items.inventory_id='f78fa4ab-a873-4603-a8e4-fe70ba6e2941'
group by equpment_item.name, equpment_item.id
order by  equpment_item.name;`);
        /*   const queryBuilder = this.equipmentItemRepository
            .createQueryBuilder('equipmentItem')
            .innerJoinAndSelect("equipmentItem.metadata", "metadata")
            .innerJoin(
                'inventory_equipment_items.equpmentItem',
                'equpmentItem',
                'equpmentItem.id = inventory_equipment_items.equpmentItem.id'
            );*/
        const queryBuilder = await this.invetororyEquipmentItemsRepository
            .createQueryBuilder('inventory_equipment_items')
            .innerJoin('inventory_equipment_items.inventory', 'inventory')
            .innerJoin('inventory_equipment_items.equpmentItem', 'equpmentItem')
            .select('inventory_equipment_items.id')
            .addSelect('equpmentItem.id')
            .addSelect('equpmentItem.name')
            .addSelect('inventory.id')
            .addSelect('COUNT(*)', 'count')
            .groupBy('inventory_equipment_items.id')
            .addGroupBy('inventory.id')
            .addGroupBy('equpmentItem.id')
            .addGroupBy('equpmentItem.name')
            .orderBy('equpmentItem.name');

        console.log(query1);
        // .groupBy('inventory_equipment_items.id');
        /* const queryBuilder = this.invetororyEquipmentItemsRepository
            .createQueryBuilder('inventory_equipment_items')
            .innerJoin('inventory_equipment_items.inventory', 'inventory')
            .innerJoin('inventory_equipment_items.equpmentItem', 'equpmentItem')
            .select('inventory_equipment_items.id')
            .addSelect('equpmentItem.id')
            .addSelect('equpmentItem.name')
            .addSelect('inventory.id')
            .addSelect(
                'COUNT(equpmentItem.id)',
                'sum'
            )
            .addGroupBy('inventory.id')
            .addGroupBy('equpmentItem.id');*/
        //  .distinctOn(['equpmentItem.id'])
        //.orderBy('equpmentItem.id')
        /*     .groupBy('inventory_equipment_items.id')
            .addGroupBy('inventory.id')
            .addGroupBy('equpmentItem.id')
            .addGroupBy('equpmentItem.name')*/ /* .groupBy('inventory_equipment_items.id')
            .addGroupBy('inventory.id')
            .addGroupBy('equpmentItem.id')
            .addGroupBy('equpmentItem.name');*/
        /**
             *    .select('inventory_equipment_items')
            .from(InventoryEqipmentItemsEntity, 'inventory_equipment_items')
            .leftJoinAndMapMany(
                'inventory_equipment_items.inventory_id',
                InventoryEntity,
                'inventory',
                'inventory.id = inventory_equipment_items.inventory_id'
            )
            .leftJoinAndMapMany(
                'inventory_equipment_items.equpment_item_id',
                EqupmentItemEntity,
                'equpment_item',
                'equpment_item.id = inventory_equipment_items.equpment_item_id'
            )
             */
        /*    .leftJoinAndMapMany(
                'inventory_equipment_items.equpment_item_id',
                EqupmentItemEntity,
                'equpment_item',
                'equpment_item.id = inventory_equipment_items.equpment_item_id'
            )
            .leftJoinAndMapMany(
                'inventory_equipment_items.inventory_id',
                InventoryEntity,
                'inventory',
                'inventory.id = inventory_equipment_items.inventory_id'
            );*/
        return paginate(query, queryBuilder, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
        });
        /*            /*   searchableColumns: [
                'id',
                'inventory',
                'inventory.id',
                'equpmentItem',
                'equpmentItem.id',
                'equpmentItem.name',
                'equpmentItem.bodyPart',
            ],*/
          /*  select: [
                'id',
                'inventory',
                'inventory.id',
                'equpmentItem',
                'equpmentItem.id',
                'equpmentItem.name',
                'equpmentItem.bodyPart',
                'count',
            ],
            relations: ['inventory', 'equpmentItem'],
            filterableColumns: {
                'equpmentItem.bodyPart': true,
                inventory_id: true,
            },*;/  
        await paginate<InventoryEntity>(query, queryBuilder, {
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
        const character = await this.characterRepostiry.findOneBy({
            user: {
                tgUserId: tgUserId,
            },
        });
        console.log(character);
        return await this.equipomentRepository.findOne({
            where: {
                id: character.equipmentId,
            },
            relations: {
                headdress: true,
                armor: true,
                cloak: true,
                leftHand: true,
                rightHand: true,
                gloves: true,
                feet: true,
                accessory: true,
                vehicle: true,
            },
        });
        /*    const query: string = `select equipment.* from equipment JOIN character ON equipment.id = character.equipment_id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`;
        const equipments: Array<EquipmentEntity> =
            await this.equipomentRepository.query(query);
        if (equipments.length !== 1) {
            return;
        }*.
        return equipments[0];*/
    }

    async findItem(itemId: string) {
        if (itemId === null) {
            return null;
        }
        return await this.equipmentItemRepository.findOne({
            where: {
                id: itemId,
            },
        });
    }

    async findInventoryByTgId(tgUserId: string) {
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

    async findInventoryIdByTgId(tgUserId: string): Promise<string> {
        const query: string = `select inventory.* from inventory JOIN character ON inventory.id = character.inventory_id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`;
        const inventories = await this.equipomentRepository.query(query);
        if (inventories.length !== 1) {
            return null;
        }
        return inventories[0].id;
    }

    async addItemToInventory(
        transactionManager: EntityManager,
        inventoryId: string,
        itemId: string
    ) {
        const inventoryEqipmentItem = new InventoryEqipmentItemsEntity();
        inventoryEqipmentItem.invetoryId = inventoryId;
        inventoryEqipmentItem.equpmentItemId = itemId;
        await transactionManager.save(inventoryEqipmentItem);
        /* await this.connection
            .createQueryBuilder()
            .relation(InventoryEntity, 'items')
            .of(inventory)
            .add(itemId);*/
    }

    async changeItemInInventory(
        itemId: string,
        slot: ENUM_BODY_PART_ENUM,
        equipment: EquipmentEntity
    ) {
        switch (slot) {
            case ENUM_BODY_PART_ENUM.ARMOR: {
                await this.equipomentRepository.update(equipment.id, {
                    armorId: itemId,
                });
                break;
            }
            case ENUM_BODY_PART_ENUM.CLOAK: {
                await this.equipomentRepository.update(equipment.id, {
                    cloakId: itemId,
                });
                break;
            }
            case ENUM_BODY_PART_ENUM.FEET: {
                await this.equipomentRepository.update(equipment.id, {
                    feetId: itemId,
                });
                break;
            }
            case ENUM_BODY_PART_ENUM.GLOVES: {
                await this.equipomentRepository.update(equipment.id, {
                    glovesId: itemId,
                });
                break;
            }
            case ENUM_BODY_PART_ENUM.HAND: {
                await this.equipomentRepository.update(equipment.id, {
                    leftHandId: itemId,
                });
                break;
            }
            case ENUM_BODY_PART_ENUM.TWO_HANDS: {
                await this.equipomentRepository.update(equipment.id, {
                    leftHandId: itemId,
                });
                break;
            }
            case ENUM_BODY_PART_ENUM.HEADDRESS: {
                await this.equipomentRepository.update(equipment.id, {
                    headdressId: itemId,
                });
                break;
            }
            case ENUM_BODY_PART_ENUM.ACCESSORY: {
                await this.equipomentRepository.update(equipment.id, {
                    accessoryId: itemId,
                });
                break;
            }
        }
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
