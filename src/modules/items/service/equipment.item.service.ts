import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { ENUM_ITEM_RARITY } from '../constants/item.entity.enum';
import { ENUM_BODY_PART_ENUM } from '../constants/body.part.enum';
import { ItemCategoryEntity } from '../entity/item.category.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
@Injectable()
export class EqupmentItemService {
    constructor(
        @InjectRepository(ItemCategoryEntity)
        private readonly categoryRepository: TreeRepository<ItemCategoryEntity>,
        @InjectRepository(EqupmentItemEntity)
        private readonly equpmentItemRepository: Repository<EqupmentItemEntity>
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
        return this.categoryRepository.findDescendants(item);
    }
    create(
        itemName: string,
        description: string,
        picture: string,
        categoryId: string,
        rarity: ENUM_ITEM_RARITY,
        bodyPart: ENUM_BODY_PART_ENUM
    ): void {
        const newItem = new EqupmentItemEntity();
        newItem.name = itemName;
        newItem.description = description;
        newItem.image = picture;
        newItem.categoryId = categoryId;
        newItem.rarity = rarity;
        newItem.bodyPart = bodyPart;
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
        this.equpmentItemRepository.save(newItem);
    }

    async getItem(itemId: string | null): Promise<EqupmentItemEntity> {
        if (itemId === null) {
            const newItem = new EqupmentItemEntity();
            newItem.name = 'Нет';
            newItem.description = '';
            newItem.image = '';
            newItem.categoryId = '';
            newItem.rarity = ENUM_ITEM_RARITY.COMMON;
            newItem.bodyPart = ENUM_BODY_PART_ENUM.NO;
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
        const res: EqupmentItemEntity[] =
            await this.equpmentItemRepository.findBy({ id: itemId });
        if (res.length) {
            return res[0];
        } else {
            throw Error('No item with such id' + itemId);
        }
    }

    async getIdWithName(itemName: string): Promise<string | null> {
        const res: EqupmentItemEntity[] =
            await this.equpmentItemRepository.findBy({ name: itemName });
        if (res.length) {
            return res[0].id;
        } else {
            return null;
        }
    }

    async getItemSlot(itemId: string): Promise<ENUM_BODY_PART_ENUM> {
        const res: EqupmentItemEntity[] =
            await this.equpmentItemRepository.findBy({ id: itemId });
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
            await this.equpmentItemRepository.findBy({ id: item_id });
        if (res.length) {
            return res[0].rarity;
        } else {
            throw Error('No item with such id' + item_id);
        }
    }
}
