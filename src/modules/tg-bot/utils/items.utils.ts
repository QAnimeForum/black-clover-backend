import { ENUM_BODY_PART_ENUM } from 'src/modules/items/constants/body.part.enum';
import { ENUM_ITEM_RARITY } from 'src/modules/items/constants/item.entity.enum';

export const convertRarityToText = (rarity: ENUM_ITEM_RARITY) => {
    switch (rarity) {
        case ENUM_ITEM_RARITY.COMMON:
            return 'Обычный';
        case ENUM_ITEM_RARITY.UNCOMMON:
            return 'Небычный';
        case ENUM_ITEM_RARITY.RARE:
            return 'Редкий';
        case ENUM_ITEM_RARITY.EPIC:
            return 'Эпический';
        case ENUM_ITEM_RARITY.LEGENDARY:
            return 'Легендарный';
        case ENUM_ITEM_RARITY.UNIQUE:
            return 'Уникальный';
    }
};

export const convertBodyPartToText = (bodyPartItem: ENUM_BODY_PART_ENUM) => {
    switch (bodyPartItem) {
        case ENUM_BODY_PART_ENUM.ARMOR:
            return 'Броня';
        case ENUM_BODY_PART_ENUM.CLOAK:
            return 'Плащ';
        case ENUM_BODY_PART_ENUM.FEET:
            return 'Обувь';
        case ENUM_BODY_PART_ENUM.GLOVES:
            return 'Перчатки';
        case ENUM_BODY_PART_ENUM.HAND:
            return 'Одноручный';
        case ENUM_BODY_PART_ENUM.TWO_HANDS:
            return 'Двуручный';
        case ENUM_BODY_PART_ENUM.HEADDRESS:
            return 'Предмет для головы';
        case ENUM_BODY_PART_ENUM.ACCESSORY:
            return 'Аксессуар';
    }
};
