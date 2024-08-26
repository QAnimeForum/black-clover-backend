import { EquipmentEntity } from 'src/modules/items/entity/equipment.entity';
import { Markup } from 'telegraf';
import { ENUM_ACTION_NAMES } from '../constants/action-names.constant';
import { InventoryEntity } from 'src/modules/items/entity/inventory.entity';
import { BotContext } from '../interfaces/bot.context';
import { EQUIPMENT_BUTTON, RESOURCES_BUTTON, INVENTORY_BUTTON, BACK_BUTTON } from '../constants/button-names.constant';
import { INVENTORY_IMAGE_PATH } from '../constants/images';

export const equipmentToText = (
    equipmentEntity: EquipmentEntity,
    username: string
) => {
    let caption = '';
    const owner = `<strong>Владелец</strong>: @${username}\n\n`;
    caption += owner;
    const title = '<strong><u>Надетая экипировка</u></strong>\n\n';
    caption += title;

    const headdressBlock = `🎩 Головной убор: ${equipmentEntity?.cap ? equipmentEntity.cap.name : '-'}\n`;
    caption += headdressBlock;
    const armorBlock = `🎽 Доспех: ${equipmentEntity?.armor ? equipmentEntity.armor.name : '-'}\n`;
    caption += armorBlock;
    const cloakBlock = `🧥 Плащ: ${equipmentEntity?.cloak ? equipmentEntity.cloak.name : '-'}\n`;
    caption += cloakBlock;
    const leftHandBlock = `🤛🏼 Левая рука:${equipmentEntity?.gloves ? equipmentEntity.gloves.name : '-'}\n`;
    caption += leftHandBlock;
    const rightHandBlock = `🤜🏼 Правая рука:${equipmentEntity?.gloves ? equipmentEntity.gloves.name : '-'}\n`;
    caption += rightHandBlock;
    const glovesBlock = `🧤 Перчатки:${equipmentEntity?.gloves ? equipmentEntity.gloves.name : '-'}\n`;
    caption += glovesBlock;
    const shoesBlock = `🥾Обувь:${equipmentEntity?.shoes ? equipmentEntity.shoes.name : '-'}\n`;
    caption += shoesBlock;
    const ringBlock = `💍 Кольцо:${equipmentEntity?.ring ? equipmentEntity.ring.name : '-'}\n`;
    caption += ringBlock;
    const vehicleBlock = `🧹 Средство передедвижения:${equipmentEntity?.vehicle ? equipmentEntity.vehicle.name : '-'}\n`;
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
            ENUM_ACTION_NAMES.CHANGE_SHOES_ACTION
        ),
        Markup.button.callback(
            '💍 Кольцо',
            ENUM_ACTION_NAMES.CHANGE_RING_ACTION
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
                    [INVENTORY_BUTTON, BACK_BUTTON],
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
