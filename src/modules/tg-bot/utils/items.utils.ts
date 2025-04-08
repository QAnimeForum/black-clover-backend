import { ENUM_BODY_PART_ENUM } from 'src/modules/items/constants/body.part.enum';
import { ENUM_ITEM_RARITY } from 'src/modules/items/constants/item.entity.enum';
import { EqupmentItemEntity } from 'src/modules/items/entity/equpment.item.entity';
import { Markup } from 'telegraf';
import {
    CREATE_OFFER_BUTTON,
    EDIT_ITEM_NAME,
    EDIT_ITEM_DESCRIPTION,
    EDIT_ITEM_RARITY,
    EDIT_ITEM_SLOT,
    EDIT_ITEM_PHOTO,
    EDIT_ITEM_CATEGORY,
    EDIT_PHYSICAL_DAMAGE,
    EDIT_PHYSICAL_DEFENSE,
    EDIT_MAGIC_DAMAGE,
    EDIT_MAGIC_DEFENSE,
    DELETE_ITEM,
    BACK_BUTTON,
    GIVE_ITEM_BUTTON,
} from '../constants/button-names.constant';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ENUM_ACTION_NAMES } from '../constants/action-names.constant';
import { ItemCategoryEntity } from 'src/modules/items/entity/item.category.entity';

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

export const parentCategoriesButtons = (
    categories: Array<ItemCategoryEntity>
) => {
    const buttons = [];
    for (let i = 0; i < categories.length; ++i) {
        buttons.push([
            Markup.button.callback(
                categories[i].name,
                `CATEGORY_ID:${categories[i].id}`
            ),
        ]);
    }
    return buttons;
};

export const childrenCategoriesButtons = (categories: ItemCategoryEntity) => {
    const children = categories.children;
    const buttons = [];
    if (children.length > 0) {
        for (let i = 0; i < children.length; ++i) {
            buttons.push([
                Markup.button.callback(
                    children[i].name,
                    `CATEGORY_ID:${children[i].id}`
                ),
            ]);
        }
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                `CATEGORY_ID:${categories.parentId}`
            ),
        ]);
    }
    return buttons;
};
export const rarityByttons = () => {
    const buttons = [
        [
            Markup.button.callback(
                'Обычные',
                `RARITY:${ENUM_ITEM_RARITY.COMMON}`
            ),
        ],
        [
            Markup.button.callback(
                'Необычные',
                `RARITY:${ENUM_ITEM_RARITY.UNCOMMON}`
            ),
        ],
        [Markup.button.callback('Редкие', `RARITY:${ENUM_ITEM_RARITY.RARE}`)],
        [
            Markup.button.callback(
                'Эпические',
                `RARITY:${ENUM_ITEM_RARITY.EPIC}`
            ),
        ],
        [
            Markup.button.callback(
                'Легендарные',
                `RARITY:${ENUM_ITEM_RARITY.LEGENDARY}`
            ),
        ],
        [
            Markup.button.callback(
                'Уникальные',
                `RARITY:${ENUM_ITEM_RARITY.UNIQUE}`
            ),
        ],
    ];
    return buttons;
};
export const itemInformation = (
    item: EqupmentItemEntity,
    isAdmin: boolean,
    isItemHasOffer: boolean
): [string, InlineKeyboardButton[][]] => {
    let caption = `<strong>${item.name}</strong>\n`;
    caption += `<strong>Редость: </strong> ${convertRarityToText(item.rarity)}\n`;
    caption += `<strong>Часть тела: </strong> ${convertBodyPartToText(item.bodyPart)}\n`;
    caption += `<strong>Категория: </strong>${item.category.name}\n`;
    caption += `<strong>Маг. урон: </strong>${item.magicAttackDamage}\n`;
    caption += `<strong>Физ. урон: </strong>${item.physicalAttackDamage}\n`;
    caption += `<strong>Магическая защита: </strong>${item.magicDefense}\n`;
    caption += `<strong>Физическая защита: </strong>${item.physicalDefense}\n`;
    caption += `<strong>Описание</strong>\n${item.description}\n`;
    const buttons = [];
    if (isAdmin) {
        if (!isItemHasOffer) {
            buttons.push([
                Markup.button.callback(
                    CREATE_OFFER_BUTTON,
                    `CREATE_OFFER_BUTTON:${item.id}`
                ),
            ]);
        }
        buttons.push([
            Markup.button.callback(EDIT_ITEM_NAME, `EDIT_ITEM_NAME:${item.id}`),
            Markup.button.callback(
                EDIT_ITEM_DESCRIPTION,
                `EDIT_ITEM_DESCRIPTION:${item.id}`
            ),
        ]);
        buttons.push([
            Markup.button.callback(
                EDIT_ITEM_RARITY,
                `EDIT_ITEM_RARITY:${item.id}`
            ),
            Markup.button.callback(EDIT_ITEM_SLOT, `EDIT_ITEM_SLOT:${item.id}`),
        ]);
        buttons.push([
            Markup.button.callback(
                EDIT_ITEM_PHOTO,
                `EDIT_ITEM_PHOTO:${item.id}`
            ),
            Markup.button.callback(
                EDIT_ITEM_CATEGORY,
                `EDIT_ITEM_CATEGORY:${item.id}`
            ),
        ]);
        buttons.push([
            Markup.button.callback(
                EDIT_PHYSICAL_DAMAGE,
                `EDIT_PHYSICAL_DAMAGE:${item.id}`
            ),
            Markup.button.callback(
                EDIT_PHYSICAL_DEFENSE,
                `EDIT_PHYSICAL_DEFENSE:${item.id}`
            ),
        ]);

        buttons.push([
            Markup.button.callback(
                EDIT_MAGIC_DAMAGE,
                `EDIT_MAGIC_DAMAGE:${item.id}`
            ),
            Markup.button.callback(
                EDIT_MAGIC_DEFENSE,
                `EDIT_MAGIC_DEFENSE:${item.id}`
            ),
        ]);

        buttons.push([
            Markup.button.callback(DELETE_ITEM, `DELETE_ITEM:${item.id}`),
        ]);
    }
    buttons.push([
        Markup.button.callback(BACK_BUTTON, `CATEGORY_ID:${item.category.id}`),
    ]);
    return [caption, buttons];
};


export const itemInformationForIssuance = (
    item: EqupmentItemEntity,
    isAdmin: boolean
): [string, InlineKeyboardButton[][]] => {
    let caption = `<strong>${item.name}</strong>\n`;
    caption += `<strong>Редость: </strong> ${convertRarityToText(item.rarity)}\n`;
    caption += `<strong>Часть тела: </strong> ${convertBodyPartToText(item.bodyPart)}\n`;
    caption += `<strong>Категория: </strong>${item.category.name}\n`;
    caption += `<strong>Маг. урон: </strong>${item.magicAttackDamage}\n`;
    caption += `<strong>Физ. урон: </strong>${item.physicalAttackDamage}\n`;
    caption += `<strong>Магическая защита: </strong>${item.magicDefense}\n`;
    caption += `<strong>Физическая защита: </strong>${item.physicalDefense}\n`;
    caption += `<strong>Описание</strong>\n${item.description}\n`;
    const buttons = [];
    if (isAdmin) {
        buttons.push([
            Markup.button.callback(
                GIVE_ITEM_BUTTON,
                `GIVE_ITEM_BUTTON:${item.id}`
            ),
        ]);
    }
    buttons.push([
        Markup.button.callback(BACK_BUTTON, `CATEGORY_ID:${item.category.id}`),
    ]);
    return [caption, buttons];
};
