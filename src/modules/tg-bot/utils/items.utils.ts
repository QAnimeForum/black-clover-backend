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

export const convertBodyPartToText = (rarity: ENUM_BODY_PART_ENUM) => {
    switch (rarity) {
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
        case ENUM_BODY_PART_ENUM.HEARDRESS:
            return 'Предмет для головы';
        case ENUM_BODY_PART_ENUM.LEEGS:
            return 'Предмет для ног';
        case ENUM_BODY_PART_ENUM.RING:
            return 'Кольцо';
        case ENUM_BODY_PART_ENUM.SHOES:
            return 'Ботинки';
        case ENUM_BODY_PART_ENUM.VEHICLE:
            return 'Транспорт';
        case ENUM_BODY_PART_ENUM.NO:
            return 'Нет';
    }
};
