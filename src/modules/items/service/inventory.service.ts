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
import { EqupmentItemsFindDto } from '../dto/equipment.items.find.dto';
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

    public async isUserHasEquipmentItem(itemId: string) {
        return this.invetororyEquipmentItemsRepository.existsBy({
            equpmentItemId: itemId,
        });
    }
    public async findAllEquipmentItems(dto: EqupmentItemsFindDto) {
        return await this.equipmentItemRepository
            .createQueryBuilder('equipment_item')
            .leftJoin(
                InventoryEqipmentItemsEntity,
                'inventory_equipment_items',
                'inventory_equipment_items.equpment_item_id = equipment_item.id'
            )
            .select('equipment_item.id', 'id')
            .addSelect('equipment_item.name', 'name')
            .addSelect('COUNT(*)', 'count')
            .groupBy('equipment_item.id')
            .orderBy('equipment_item.name')
            .limit(dto.limit)
            .offset((dto.page - 1) * dto.limit)
            .where('inventory_equipment_items.inventory_id = :id', {
                id: dto.inventoryId,
            })
            .andWhere('equipment_item.body_part = :bodyPart', {
                bodyPart: dto.bodyPart,
            })
            .getRawMany();
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
        const character = await this.characterRepostiry.findOne({
            where: {
                user: {
                    tgUserId: tgUserId,
                },
            },
        });
        return await this.equipomentRepository.findOne({
            where: {
                id: character.equipmentId,
            },
            relations: {
                headdress: {
                    equpmentItem: true,
                },
                armor: {
                    equpmentItem: true,
                },
                cloak: {
                    equpmentItem: true,
                },
                leftHand: {
                    equpmentItem: true,
                },
                rightHand: {
                    equpmentItem: true,
                },
                gloves: {
                    equpmentItem: true,
                },
                feet: {
                    equpmentItem: true,
                },
                accessory: {
                    equpmentItem: true,
                },
                vehicle: {
                    equpmentItem: true,
                },
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
        return await this.invetororyEquipmentItemsRepository.findOne({
            where: {
                id: itemId,
            },
            relations: {
                equpmentItem: true,
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
        let inventory_item: InventoryEqipmentItemsEntity | null = null;
        if (itemId != null) {
            inventory_item =
                await this.invetororyEquipmentItemsRepository.findOneBy({
                    equpmentItemId: itemId,
                });
        }
        switch (slot) {
            case ENUM_BODY_PART_ENUM.ARMOR: {
                return await this.equipomentRepository.update(equipment.id, {
                    armorId: inventory_item?.id ?? null,
                });
            }
            case ENUM_BODY_PART_ENUM.CLOAK: {
                return await this.equipomentRepository.update(equipment.id, {
                    cloakId: inventory_item?.id ?? null,
                });
            }
            case ENUM_BODY_PART_ENUM.FEET: {
                return await this.equipomentRepository.update(equipment.id, {
                    feetId: inventory_item?.id ?? null,
                });
            }
            case ENUM_BODY_PART_ENUM.GLOVES: {
                return await this.equipomentRepository.update(equipment.id, {
                    glovesId: inventory_item?.id ?? null,
                });
            }
            case ENUM_BODY_PART_ENUM.HAND: {
                return await this.equipomentRepository.update(equipment.id, {
                    leftHandId: inventory_item?.id ?? null,
                });
            }
            case ENUM_BODY_PART_ENUM.TWO_HANDS: {
                return await this.equipomentRepository.update(equipment.id, {
                    leftHandId: inventory_item?.id ?? null,
                });
            }
            case ENUM_BODY_PART_ENUM.HEADDRESS: {
                return await this.equipomentRepository.update(equipment.id, {
                    headdressId: inventory_item?.id ?? null,
                });
            }
            case ENUM_BODY_PART_ENUM.ACCESSORY: {
                return await this.equipomentRepository.update(equipment.id, {
                    accessoryId: inventory_item?.id ?? null,
                });
            }
        }
    }

    async giveInventoryItemToUser(userTgId: string, itemId: string) {
        const inventory = await this.findInventoryByTgId(userTgId);
        const inventoryEqipmentItem = new InventoryEqipmentItemsEntity();
        inventoryEqipmentItem.invetoryId = inventory.id;
        inventoryEqipmentItem.equpmentItemId = itemId;
        return await this.invetororyEquipmentItemsRepository.save(
            inventoryEqipmentItem
        );
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
