import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TreeRepository } from 'typeorm';

import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { ENUM_ITEM_RARITY } from '../constants/item.entity.enum';
import { ENUM_BODY_PART_ENUM } from '../constants/body.part.enum';
import { ItemCategoryEntity } from '../entity/item.category.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { ShopEntity } from '../entity/shop.entity';
import { EquipmentItemDto } from '../dto/equipment.item.dto';
import fs from 'fs';
@Injectable()
export class EqupmentItemService {
    constructor(
        @InjectRepository(ItemCategoryEntity)
        private readonly categoryRepository: TreeRepository<ItemCategoryEntity>,
        @InjectRepository(EqupmentItemEntity)
        private readonly equipmentItemRepository: Repository<EqupmentItemEntity>,
        @InjectRepository(ShopEntity)
        private readonly shopRepository: Repository<ShopEntity>,
        @InjectDataSource()
        private readonly connection: DataSource
    ) {}

    /* public async findAllItemCategories(query: PaginateQuery) {
        return paginate(query, this.categoryEntity, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
        });
    }*/
    public async findCategories() {
        return this.categoryRepository.findRoots();
    }
    public async findCategoriesByRoot(categoryId: string) {
        const item = await this.categoryRepository.findOneBy({
            id: categoryId,
        });
        return this.categoryRepository.findDescendantsTree(item);
    }
    /**
     *  itemName: string,
        description: string,
        picture: string,
        categoryId: string,
        rarity: ENUM_ITEM_RARITY,
        bodyPart: ENUM_BODY_PART_ENUM
     */
    async create(dto: EquipmentItemDto) {
        const newItem = new EqupmentItemEntity();

        const image = dto.image;
        const saveFormat = image
            .split('.')
            [image.split('.').length - 1].toLowerCase();
        const newName = `0.${saveFormat}`;

        newItem.name = dto.name;
        newItem.description = dto.description;
        newItem.image = newName;
        newItem.categoryId = dto.categoryId;
        newItem.rarity = dto.rarity;
        newItem.bodyPart = dto.body;
        newItem.heal = 0;
        newItem.strength = 0;
        newItem.dexterity = 0;
        newItem.vitality = 0;
        newItem.intellect = 0;
        newItem.luck = 0;
        newItem.criticalChance = 0;
        newItem.criticalDamage = 0;
        newItem.dodgeChance = 0;
        newItem.maxMagicPower = 0;
        newItem.mapHealth = 0;
        newItem.armor = 0;
        newItem.physicalAttackDamage = dto.physicalAttackDamage;
        newItem.magicAttackDamage = dto.magicAttackDamage;
        newItem.inventorySpace = 0;
        newItem.physicalDefense = dto.physicalDefense;
        newItem.magicDefense = dto.magicDefense;
        newItem.accuracyRate = 0;
        newItem.evasion = 0;
        newItem.speed = 0;
        newItem.jump = 0;
        const savedItem = await this.equipmentItemRepository.save(newItem);

        const dir = `${process.env.APP_API_URL}/Assets/images/items/${savedItem.id}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(image, `${dir}/${newName}`);
        return savedItem;
    }

    async findItemById(itemId: string | null): Promise<EqupmentItemEntity> {
        if (itemId === null) {
            const newItem = new EqupmentItemEntity();
            newItem.name = 'Нет';
            newItem.description = '';
            newItem.image = '';
            newItem.categoryId = '';
            newItem.rarity = ENUM_ITEM_RARITY.COMMON;
            newItem.bodyPart = ENUM_BODY_PART_ENUM.FEET;
            newItem.heal = 0;
            newItem.strength = 0;
            newItem.dexterity = 0;
            newItem.vitality = 0;
            newItem.intellect = 0;
            newItem.luck = 0;
            newItem.criticalChance = 0;
            newItem.criticalDamage = 0;
            newItem.dodgeChance = 0;
            newItem.maxMagicPower = 0;
            newItem.mapHealth = 0;
            newItem.armor = 0;
            newItem.physicalAttackDamage = 0;
            newItem.magicAttackDamage = 0;
            newItem.inventorySpace = 0;
            newItem.physicalDefense = 0;
            newItem.magicDefense = 0;
            newItem.accuracyRate = 0;
            newItem.evasion = 0;
            newItem.speed = 0;
            newItem.jump = 0;
            return newItem;
        }
        const res: EqupmentItemEntity =
            await this.equipmentItemRepository.findOne({
                where: { id: itemId },
                relations: ['category'],
            });
        if (res) {
            return res;
        } else {
            throw Error('No item with such id' + itemId);
        }
    }

    async findAllEquipmentItemsNotOnShop(query: PaginateQuery) {
        /*   const sqlQuery = 'select * from equpment_item LEFT_JOIN shop ON equipment_item.id = shop.item_id where shop.id is null';*/
        const queryBuilder = this.equipmentItemRepository
            .createQueryBuilder()
            .select('equipment_item')
            .from(EqupmentItemEntity, 'equipment_item')
            .leftJoinAndMapOne(
                'equipment_item.id',
                ShopEntity,
                'shop',
                'shop.item_id = equipment_item.id'
            )
            .where('shop.id = :id', { id: null });
        return paginate(query, queryBuilder, {
            sortableColumns: ['id', 'name', 'bodyPart'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name', 'bodyPart'],
            select: ['id', 'name', 'bodyPart', 'category', 'categoryId'],
            filterableColumns: {},
        });
    }

    async findOffers(query: PaginateQuery) {
        return paginate(query, this.shopRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['id'],
            select: [
                'id',
                'copper',
                'silver',
                'electrum',
                'gold',
                'platinum',
                'item',
                'item.id',
                'item.name',
                'item.description',
                'item.bodyPart',
                'item.rarity',
                'item.category',
                'item.category.id',
                'item.category.name',
                'item.physicalAttackDamage',
                'item.physicalDefense',
                'item.magicAttackDamage',
                'item.magicDefense',
                'item.image',
            ],
            relations: ['item', 'item.category'],
        });
    }

    async findAllEquipmentItems(query: PaginateQuery) {
        return paginate(query, this.equipmentItemRepository, {
            sortableColumns: ['id', 'name', 'bodyPart'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name', 'bodyPart'],
            select: [
                'id',
                'name',
                'bodyPart',
                'category',
                'categoryId',
                'rarity',
            ],
            filterableColumns: {
                bodyPart: true,
                categoryId: true,
                rarity: true,
            },
        });
    }
    async getIdWithName(itemName: string): Promise<string | null> {
        const res: EqupmentItemEntity[] =
            await this.equipmentItemRepository.findBy({ name: itemName });
        if (res.length) {
            return res[0].id;
        } else {
            return null;
        }
    }

    async getItemSlot(itemId: string): Promise<ENUM_BODY_PART_ENUM> {
        const res: EqupmentItemEntity[] =
            await this.equipmentItemRepository.findBy({ id: itemId });
        if (res.length) {
            return res[0].bodyPart;
        } else {
            throw Error('No item with such id' + itemId);
        }
    }

    async getItemRaririty(item_id: string): Promise<ENUM_ITEM_RARITY> {
        if (item_id === null) {
            return ENUM_ITEM_RARITY.COMMON;
        }
        const res: EqupmentItemEntity[] =
            await this.equipmentItemRepository.findBy({ id: item_id });
        if (res.length) {
            return res[0].rarity;
        } else {
            throw Error('No item with such id' + item_id);
        }
    }
    async changeItemName(dto: ChangeNameDto) {
        return await this.connection
            .createQueryBuilder()
            .update(EqupmentItemEntity)
            .set({ name: dto.name })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }
    async changeItemDescription(dto: ChangeDescriptionDto) {
        return await this.connection
            .createQueryBuilder()
            .update(EqupmentItemEntity)
            .set({ description: dto.description })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }

    async changeItemRarity(dto: ChangeRarityDto) {
        return await this.connection
            .createQueryBuilder()
            .update(EqupmentItemEntity)
            .set({ rarity: dto.rarity })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }

    async changeItemCategory(dto: ChangeItemCategoryDto) {
        return await this.connection
            .createQueryBuilder()
            .update(EqupmentItemEntity)
            .set({ categoryId: dto.categoryId })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }

    async changeBodyPart(dto: ChangeBodyPartDto) {
        return await this.connection
            .createQueryBuilder()
            .update(EqupmentItemEntity)
            .set({ bodyPart: dto.bodyPart })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }
    async changePhoto(dto: ChangePhotoDto) {
        return await this.connection
            .createQueryBuilder()
            .update(EqupmentItemEntity)
            .set({ image: dto.photoPath })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }
}

class ChangeNameDto {
    id: string;
    name: string;
}

class ChangeDescriptionDto {
    id: string;
    description: string;
}

class ChangeRarityDto {
    id: string;
    rarity: ENUM_ITEM_RARITY;
}

class ChangeBodyPartDto {
    id: string;
    bodyPart: ENUM_BODY_PART_ENUM;
}

class ChangeItemCategoryDto {
    id: string;
    categoryId: string;
}

class ChangePhotoDto {
    id: string;
    photoPath: string;
}
