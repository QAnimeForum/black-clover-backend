import { DataSource, Repository } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { categories } from '../../Assets/json/items/categories_with_items.json';
import { EqupmentItemEntity } from '../modules/items/entity/equpment.item.entity';
import { ItemCategoryEntity } from '../modules/items/entity/item.category.entity';
import { ENUM_ITEM_RARITY } from '../modules/items/constants/item.entity.enum';
import { ENUM_BODY_PART_ENUM } from '../modules/items/constants/body.part.enum';
export default class ItemsSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const equpmentItemRepository =
            dataSource.getRepository(EqupmentItemEntity);
        const categoriesRepository =
            dataSource.getRepository(ItemCategoryEntity);
        for (let i = 0; i < categories.length; ++i) {
            const item = categories[i];
            const category = new ItemCategoryEntity();
            category.name = item.name;
            category.description = '';
            const parent = await categoriesRepository.save(category);
            await this.saveChildren(
                item.children,
                parent,
                equpmentItemRepository,
                categoriesRepository
            );
        }
    }

    async saveChildren(
        array: Array<any>,
        parent: ItemCategoryEntity,
        equpmentItemRepository: Repository<EqupmentItemEntity>,
        categoriesRepository: Repository<ItemCategoryEntity>
    ) {
        console.log(array);
        for (let i = 0; i < array.length; ++i) {
            const item = array[i];
            console.log(item);
            if (item.isItem) {
                const newItem = new EqupmentItemEntity();
                newItem.name = item.name;
                newItem.description = item.description;
                newItem.image = item.image;
                newItem.categoryId = parent.id;
                newItem.rarity = ENUM_ITEM_RARITY[item.rarity];
                newItem.bodyPart = ENUM_BODY_PART_ENUM[item.bodyPart];
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
                newItem.physicalAttackDamage = item.physicalAttackDamage;
                newItem.magicAttackDamage = item.magicAttackDamage;
                newItem.inventorySpace = 0;
                newItem.physicalDefense = item.physicalDefense;
                newItem.magicDefense = item.magicDefense;
                newItem.accuracyRate = 0;
                newItem.evasion = 0;
                newItem.speed = 0;
                newItem.jump = 0;
                console.log(newItem);
                await equpmentItemRepository.save(newItem);
            } else {
                const category = new ItemCategoryEntity();
                category.name = item.name;
                category.description = '';
                category.parent = parent;
                const newParent = await categoriesRepository.save(category);
                await this.saveChildren(
                    item.children,
                    newParent,
                    equpmentItemRepository,
                    categoriesRepository
                );
            }
        }
    }
}
