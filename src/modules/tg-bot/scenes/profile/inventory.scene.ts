import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { INVENTORY_IMAGE_PATH } from '../../constants/images';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { InventoryService } from 'src/modules/items/service/inventory.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
    ARMOR_BUTTON,
    BACK_BUTTON,
    CHANGE_EQUIPMENT_BUTTON,
    EQUIPMENT_BUTTON,
    FOOD_BUTTON,
    GEARS_BUTTON,
    JEWEIRY_BUTTON,
    MINERALS_BUTTON,
    RESOURCES_BUTTON,
    VEHICLES_BUTTON,
    WEAPONS_BUTTON,
} from '../../constants/button-names.constant';
import {
    equipmentInlineKeyBoard,
    equipmentToText,
} from '../../utils/inventory.utils';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';
import { Paginated } from 'nestjs-paginate';
import { ENUM_BODY_PART_ENUM } from 'src/modules/items/constants/body.part.enum';

@Scene(ENUM_SCENES_ID.INVENTORY_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class InventoryScene {
    constructor(
        private readonly inventoryService: InventoryService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const equipment = await this.inventoryService.findEquipmentByTgId(
            sender.id
        );
        const chatType = ctx.chat.type;
        if (chatType == 'private') {
            const caption = equipmentToText(equipment, sender.username);
            await ctx.sendPhoto(
                {
                    source: INVENTORY_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [CHANGE_EQUIPMENT_BUTTON],
                        [EQUIPMENT_BUTTON, RESOURCES_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            const caption = equipmentToText(equipment, sender.username);
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

        /**
         *  ...Markup.keyboard([
                    [EQUIPMENT_BUTTON, RESOURCES_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
         */
        /**
         *  ...Markup.keyboard([
                    [EQUIPMENT_BUTTON, RESOURCES_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
         */
    }
    /**
     * 
     * @param ctx 
    /**
    *  const weaponBlock = `${WEAPONS_BUTTON}:-\n`;
    const armorBlock = `${ARMOR_BUTTON}: -\n`;
    const jeweiryBlock = `${JEWEIRY_BUTTON}: -\n`;
    const foodBlock = `${FOOD_BUTTON}: -\n`;
    const alcoholBlock = `${ALCOHOL_BUTTON}: -\n`;
    const toolKitBlock = `${TOOLKIT_BUTTON}: -\n`;
    const gearsBlock = `${GEARS_BUTTON}: -\n`;
    const vehiclesBlock = `${VEHICLES_BUTTON}: -\n`;

    const resourcesTitle = `strong><u>♻️ Ресурсы</u></strong>\n\n`;
    */
    /**
     * 🤴️sanscri 🔸5 ❤️(268/268)

Надетая экипировка:

🔪 Оружие: Деревянный меч [I]  (11/25)
🎩 Шлем: -
🎽 Доспех: -
🧤 Перчатки: Перчатки новичка [I]  (25/25)
🥾 Сапоги: -
🛡 Щит: -
💍 Кольцо: -
📿 Колье: -
🌂 Аксессуар: -
🔧 Инструменты: -
    {
            source: INVENTORY_IMAGE_PATH,
        },
        {
            caption,
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(MINERALS_BUTTON, MINERALS_BUTTON),
                    Markup.button.callback(JEWEIRY_BUTTON, JEWEIRY_BUTTON),
                ],
                [
                    Markup.button.callback(ALCOHOL_BUTTON, ALCOHOL_BUTTON),
                    Markup.button.callback(FOOD_BUTTON, FOOD_BUTTON),
                ],

                [
                    Markup.button.callback(WEAPONS_BUTTON, WEAPONS_BUTTON),
                    Markup.button.callback(ARMOR_BUTTON, ARMOR_BUTTON),
                ],
                [
                    Markup.button.callback(GEARS_BUTTON, GEARS_BUTTON),
                    Markup.button.callback(VEHICLES_BUTTON, VEHICLES_BUTTON),
                ],
            ]),
        }
    );*/

    @Hears(CHANGE_EQUIPMENT_BUTTON)
    async changeEquipment(@Ctx() ctx: BotContext, @Sender() sender) {
        const equipment = await this.inventoryService.findEquipmentByTgId(
            sender.id
        );
        const caption = equipmentToText(equipment, sender.username);
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

    @Action(ENUM_ACTION_NAMES.CHANGE_CAP)
    async changeCap(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.HEARDRESS;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_ARMOR)
    async changeArmor(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.ARMOR;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_LEFT_HAND)
    async changeLeftHand(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.LEFT_HEND;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_RIGHT_HAND)
    async changeRightHand(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.RIGHT_HEND;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_CLOAK_ACTION)
    async changeCloak(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.CLOAK;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_GLOVES_ACTION)
    async changeGloves(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.GLOVES;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_RING_ACTION)
    async changeRing(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.RING;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_SHOES_ACTION)
    async changeShoes(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.SHOES;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_VEHICLE_ACTION)
    async changeVehicle(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.VEHICLE;
        this.chooseItem(ctx, tgUserId, currentSlot);
    }
    async chooseItem(
        ctx: BotContext,
        tgUserId: string,
        currentSlot: ENUM_BODY_PART_ENUM
    ) {
        let items: Paginated<any>;
        if (currentSlot == ENUM_BODY_PART_ENUM.VEHICLE) {
            items = await this.inventoryService.findAllVehicles(
                {
                    path: '',
                },
                tgUserId
            );
        } else {
            items = await this.inventoryService.findAllEquipmentItems(
                {
                    path: '',
                    filter: {
                        bodyPart: `$eq:${currentSlot}`,
                    },
                },
                tgUserId
            );
        }
        let caption = '';
        if (items.data.length == 0) {
            caption = 'У вас нет экипировки подходящего типа!';
        } else {
            caption = 'Теперь выберите предмет, который вы хотите надеть:\n';
            items.data.map((item, index) => {
                caption += `${index + 1})${item.name}\n`;
            });
            caption += 'Чтобы убрать предмет из слота введите 0';
        }
        await ctx.editMessageCaption(
            caption,
            Markup.inlineKeyboard([
                Markup.button.callback(
                    BACK_BUTTON,
                    ENUM_ACTION_NAMES.BACK_TO_EQUIP_ITEM
                ),
            ])
        );
    }

    @Action(ENUM_ACTION_NAMES.BACK_TO_EQUIP_ITEM)
    async backToEquipItem(@Ctx() ctx: BotContext, @Sender() sender) {
        const equipment = await this.inventoryService.findEquipmentByTgId(
            sender.id
        );
        const caption = equipmentToText(equipment, sender.username);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(equipmentInlineKeyBoard()),
        });
    }
    @Action(MINERALS_BUTTON)
    async minrals(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список минералов, которые у вас есть</strong>\n\n';
        const not = 'У вас нет минералов';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(JEWEIRY_BUTTON)
    async jeweiry(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список ювелирных изделий, которые у вас есть</strong>\n\n';
        const not = 'У вас нет ювелирки';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(FOOD_BUTTON)
    async food(@Ctx() ctx: BotContext) {
        const title = '<strong>Список еды, которые у вас есть</strong>\n\n';
        const not = 'У вас нет еды';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }

    @Hears(WEAPONS_BUTTON)
    async weapon(@Ctx() ctx: BotContext) {
        const title = '<strong>Список оружия, которые у вас есть</strong>\n\n';
        const not = 'У вас нет оружия';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(ARMOR_BUTTON)
    async armor(@Ctx() ctx: BotContext) {
        const title = '<strong>Список бпони, которое у вас есть</strong>\n\n';
        const not = 'У вас нет брони';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(GEARS_BUTTON)
    async gears(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список механизмов, которые у вас есть</strong>\n\n';
        const not = 'У вас нет механизмов';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(VEHICLES_BUTTON)
    async vehicles(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список средств передвижения, которые у вас есть</strong>\n\n';
        const not = 'У вас нет средств передвижения';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
