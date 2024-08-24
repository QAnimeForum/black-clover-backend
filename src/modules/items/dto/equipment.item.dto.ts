import { ENUM_BODY_PART_ENUM } from '../constants/body.part.enum';
import { ENUM_ITEM_RARITY } from '../constants/item.entity.enum';

export class EquipmentItemDto {
    name: string;
    description: string;
    rarity: ENUM_ITEM_RARITY;
    body: ENUM_BODY_PART_ENUM;
    image: string;
    categoryId: string;
    physicalAttackDamage: number;
    magicAttackDamage: number;
    physicalDefense: number;
    magicDefense: number;
}
