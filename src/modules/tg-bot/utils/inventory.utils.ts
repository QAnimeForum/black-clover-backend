import { EquipmentEntity } from 'src/modules/items/entity/equipment.entity';
import { Markup } from 'telegraf';
import { ENUM_ACTION_NAMES } from '../constants/action-names.constant';
import { InventoryEntity } from 'src/modules/items/entity/inventory.entity';
import { BotContext } from '../interfaces/bot.context';
import {
    EQUIPMENT_BUTTON,
    RESOURCES_BUTTON,
    BACK_BUTTON,
    FOOD_BUTTON,
    REAL_ESTATE_BUTTON,
    RECIPIES_BUTTON,
    WORKS_OF_ART_BUTTON,
} from '../constants/button-names.constant';
import { INVENTORY_IMAGE_PATH } from '../constants/images';
import { ShopEntity } from 'src/modules/items/entity/shop.entity';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { convertRarityToText, convertBodyPartToText } from './items.utils';
export const equipmentToText = (
    equipmentEntity: EquipmentEntity,
    username: string
) => {
    let caption = '';
    const owner = `<strong>Владелец</strong>: @${username}\n\n`;
    caption += owner;
    const title = '<strong><u>Надетая экипировка</u></strong>\n\n';
    caption += title;

    const headdressBlock = `🎩 Головной убор: ${equipmentEntity.headdress ? equipmentEntity.headdress.equpmentItem.name : '-'}\n`;
    caption += headdressBlock;
    const armorBlock = `🎽 Доспех: ${equipmentEntity.armor ? equipmentEntity.armor.equpmentItem.name : '-'}\n`;
    caption += armorBlock;
    const cloakBlock = `🧥 Плащ: ${equipmentEntity.cloak ? equipmentEntity.cloak.equpmentItem.name : '-'}\n`;
    caption += cloakBlock;
    const leftHandBlock = `🤛🏼 Левая рука: ${equipmentEntity.leftHand ? equipmentEntity.leftHand.equpmentItem.name : '-'}\n`;
    caption += leftHandBlock;
    const rightHandBlock = `🤜🏼 Правая рука: ${equipmentEntity.rightHand ? equipmentEntity.rightHand.equpmentItem.name : '-'}\n`;
    caption += rightHandBlock;
    const glovesBlock = `🧤 Перчатки: ${equipmentEntity.gloves ? equipmentEntity.gloves.equpmentItem.name : '-'}\n`;
    caption += glovesBlock;
    const shoesBlock = `🥾Обувь: ${equipmentEntity.feet ? equipmentEntity.feet.equpmentItem.name : '-'}\n`;
    caption += shoesBlock;
    const ringBlock = `💍 Аксессуар: ${equipmentEntity.accessory ? equipmentEntity.accessory.equpmentItem.name : '-'}\n`;
    caption += ringBlock;
    const vehicleBlock = `🧹 Средство передедвижения: ${equipmentEntity.vehicle ? equipmentEntity.vehicle.equpmentItem.name : '-'}\n`;
    caption += vehicleBlock;
    /*  const helmetBlock = `🪖 Шлем: ${equipmentEntity?.helmet ? equipmentEntity.helmet.name : '-'}\n`;
    caption += helmetBlock;
    const weaponBlock = `🔪 Оружие: ${equipmentEntity?.weapon ? equipmentEntity.weapon.name : '-'}\n`;
    caption += weaponBlock;
    const armorBlock = `🎽 Доспех: ${equipmentEntity?.armor ? equipmentEntity.armor.name : '-'}\n`;
    caption += armorBlock;
    const cloakBlock = `🧥 Плащ: ${equipmentEntity?.cloak ? equipmentEntity.cloak.name : '-'}\n`;
    caption += cloakBlock;
    const neckBlock = `📿 Акксесуары на шее: ${equipmentEntity?.neck ? equipmentEntity.neck.name : '-'}\n`;
    caption += neckBlock;

    const shieldBlock = `🛡 Шит:${equipmentEntity?.shield ? equipmentEntity.shield.name : '-'}\n`;
    caption += shieldBlock;

   *
    *  const helmetBlock = `🪖 Шлем: ${equipmentEntity?.helmet ? equipmentEntity.helmet.name : '-'}\n`;
    caption += helmetBlock;
    const weaponBlock = `🔪 Оружие: ${equipmentEntity?.weapon ? equipmentEntity.weapon.name : '-'}\n`;
    caption += weaponBlock;
    const armorBlock = `🎽 Доспех: ${equipmentEntity?.armor ? equipmentEntity.armor.name : '-'}\n`;
    caption += armorBlock;
    const cloakBlock = `🧥 Плащ: ${equipmentEntity?.cloak ? equipmentEntity.cloak.name : '-'}\n`;
    caption += cloakBlock;
    const neckBlock = `📿 Акксесуары на шее: ${equipmentEntity?.neck ? equipmentEntity.neck.name : '-'}\n`;
    caption += neckBlock;
    const capBlock = `🎩 Шляпа: ${equipmentEntity?.cap ? equipmentEntity.cap.name : '-'}\n`;
    caption += capBlock;
    const faceBlock = `🧑‍🦱Маски/Пирсинг: ${equipmentEntity?.face ? equipmentEntity.face.name : '-'}\n`;
    caption += faceBlock;
    const earBlock = `🦻Артефакты/украшения в ушах: ${equipmentEntity?.face ? equipmentEntity.ear.name : '-'}\n`;
    caption += earBlock;
    const eyeBlock = `👁 Артефакты для глаз: ${equipmentEntity?.face ? equipmentEntity.eye.name : '-'}\n`;
    caption += eyeBlock;
    const clothesBlock = `🧥 Одежда:${equipmentEntity?.clothes ? equipmentEntity.clothes.name : '-'}\n`;
    caption += clothesBlock;

    const pantsBlock = `🦵 Брюки:${equipmentEntity?.pants ? equipmentEntity.pants.name : '-'}\n`;
    caption += pantsBlock;

    const shoesBlock = `🥾 Сапоги:${equipmentEntity?.shoes ? equipmentEntity.shoes.name : '-'}\n`;
    caption += shoesBlock;

    const glovesBlock = `🧤 Перчатки:${equipmentEntity?.gloves ? equipmentEntity.gloves.name : '-'}\n`;
    caption += glovesBlock;

    const shieldBlock = `🛡 Шит:${equipmentEntity?.shield ? equipmentEntity.shield.name : '-'}\n`;
    caption += shieldBlock;

    const ringBlock = `💍 Кольцо:${equipmentEntity?.ring ? equipmentEntity.ring.name : '-'}\n`;
    caption += ringBlock;

    const vehicleBlock = `🧹 Средство передедвижения:${equipmentEntity?.vehicle ? equipmentEntity.vehicle.name : '-'}\n`;
    caption += vehicleBlock;
    */
    return caption;
};

export const equipmentInlineKeyBoard = () => {
    const buttons = [];

    buttons.push([
        Markup.button.callback(
            '🎩 Головной убор',
            ENUM_ACTION_NAMES.CHANGE_CAP
        ),
        Markup.button.callback('🎽 Доспех', ENUM_ACTION_NAMES.CHANGE_ARMOR),
    ]);
    buttons.push([
        Markup.button.callback(
            '🤛🏼 Левая рука',
            ENUM_ACTION_NAMES.CHANGE_LEFT_HAND
        ),
        Markup.button.callback(
            '🤜🏼 Правая рука',
            ENUM_ACTION_NAMES.CHANGE_RIGHT_HAND
        ),
    ]);

    buttons.push([
        Markup.button.callback(
            '🧥 Плащ',
            ENUM_ACTION_NAMES.CHANGE_CLOAK_ACTION
        ),
        Markup.button.callback(
            '🧤 Перчатки',
            ENUM_ACTION_NAMES.CHANGE_GLOVES_ACTION
        ),
    ]);
    buttons.push([
        Markup.button.callback(
            '🥾  Сапоги',
            ENUM_ACTION_NAMES.CHANGE_FEET_ACTION
        ),
        Markup.button.callback(
            '💍 Аксессуар',
            ENUM_ACTION_NAMES.CHANGE_ACCESSORY_ACTION
        ),
    ]);
    buttons.push([
        Markup.button.callback(
            '🧹 Средство передедвижения',
            ENUM_ACTION_NAMES.CHANGE_VEHICLE_ACTION
        ),
    ]);
    return buttons;
};

export const showInvnentoryStatistics = async (
    ctx: BotContext,
    inventory: InventoryEntity
) => {
    const chatType = ctx.chat.type;
    let caption = '<strong><u>Инвентарь</u></strong>\n\n';
    caption += `<strong>Демонические осколки</strong>: ${inventory.devilFragments}\n`;
    if (chatType == 'private') {
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [EQUIPMENT_BUTTON, RESOURCES_BUTTON],
                    [FOOD_BUTTON, WORKS_OF_ART_BUTTON],
                    [REAL_ESTATE_BUTTON, RECIPIES_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    } else {
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(equipmentInlineKeyBoard()),
            }
        );
    }
};

export const showOffers = (
    offer: ShopEntity | null,
    isUserHasEquipmentItem: boolean,
    currentPage: number,
    totalPages: number,
    totalItems: number
): [string, InlineKeyboardButton[][]] => {
    let caption = ``;
    const buttons: InlineKeyboardButton[][] = [];

    if (totalPages == 0) {
        caption = 'Предложений пока нет.';
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
        return [caption, buttons];
    }

    caption = showOffer(offer, isUserHasEquipmentItem, totalItems);
    buttons.push([
        Markup.button.callback(`Купить`, `BUY:${offer.id}:${currentPage}`),
    ]);
    if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.SHOP_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.SHOP_PREVIOUS_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.SHOP_PREVIOUS_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.SHOP_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    }
    return [caption, buttons];
};

const showOffer = (
    offer: ShopEntity,
    isUserHasEquipmentItem,
    totalItems: number
) => {
    const copperText = `${offer.copper} 🟤`;
    const silverText = `${offer.silver} ⚪️`;
    const electrumText = `${offer.electrum} 🔵`;
    const goldTextText = `${offer.gold} 🟡`;
    const platinumText = `${offer.platinum} 🪙`;
    const price = `${platinumText} ${goldTextText} ${electrumText} ${silverText} ${copperText} \n`;

    let caption =
        '🛍️ Для вас сегодня есть <b>' +
        totalItems +
        '</b> предложений:\n\n⌨ Название предмета: <b>' +
        offer.item.name +
        '</b>\n💎 Категория: <b> ' +
        offer.item.category.name +
        '</b>\n⭐️ Редкость: <b> ' +
        convertRarityToText(offer.item.rarity) +
        '</b>\n👚 Слот: <b>' +
        convertBodyPartToText(offer.item.bodyPart) +
        '</b>\n\n👊🏼 Физ. урон: <b> ' +
        offer.item.physicalAttackDamage +
        '</b>\n👊🏼 Маг. урон: <b> ' +
        offer.item.magicAttackDamage +
        '</b>\n🛡 Физ. защита: <b> ' +
        offer.item.physicalDefense +
        '</b>\n🛡 Маг. защита: <b> ' +
        offer.item.magicDefense +
        '</b>\n💴 Цена: <b>' +
        price +
        '</b>\n<b>📃 Описание\n</b>' +
        offer.item.description +
        '\n';
    if (isUserHasEquipmentItem) {
        caption += `<b>У вас уже есть этот предмет</b>`;
    }
    return caption;
};
