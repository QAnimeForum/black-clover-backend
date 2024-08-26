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
    INVENTORY_BUTTON,
    JEWEIRY_BUTTON,
    MINERALS_BUTTON,
    RESOURCES_BUTTON,
    VEHICLES_BUTTON,
    WEAPONS_BUTTON,
} from '../../constants/button-names.constant';
import {
    equipmentInlineKeyBoard,
    equipmentToText,
    showInvnentoryStatistics,
} from '../../utils/inventory.utils';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';
import { Paginated } from 'nestjs-paginate';
import { ENUM_BODY_PART_ENUM } from 'src/modules/items/constants/body.part.enum';
import { InventoryEqipmentItemsEntity } from 'src/modules/items/entity/inventory.entity';

@Scene(ENUM_SCENES_ID.INVENTORY_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class InventoryScene {
    constructor(
        private readonly inventoryService: InventoryService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const inventory = await this.inventoryService.findInventoryIdByTgId(
            sender.tgUserId
        );
        console.log(inventory);
        await showInvnentoryStatistics(ctx, inventory);
    }
    @Hears(INVENTORY_BUTTON)
    async inventory(@Ctx() ctx: BotContext, @Sender() sender) {
        const inventory = await this.inventoryService.findInventoryIdByTgId(
            sender.tgUserId
        );
        console.log(inventory);
        await showInvnentoryStatistics(ctx, inventory);
    }

    @Hears(EQUIPMENT_BUTTON)
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
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_ARMOR)
    async changeArmor(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.ARMOR;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_LEFT_HAND)
    async changeLeftHand(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.HAND;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_RIGHT_HAND)
    async changeRightHand(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.HAND;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_CLOAK_ACTION)
    async changeCloak(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.CLOAK;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_GLOVES_ACTION)
    async changeGloves(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.GLOVES;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_RING_ACTION)
    async changeRing(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.RING;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_SHOES_ACTION)
    async changeShoes(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.SHOES;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_VEHICLE_ACTION)
    async changeVehicle(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.VEHICLE;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }
    async chooseItem(
        ctx: BotContext,
        tgUserId: string,
        currentSlot: ENUM_BODY_PART_ENUM
    ) {
        const inventory =
            await this.inventoryService.findInventoryIdByTgId(tgUserId);
        /**
       *   if (currentSlot == ENUM_BODY_PART_ENUM.VEHICLE) {
            items = await this.inventoryService.findAllVehicles({
                path: '',
                filter: {
                    inventoryId: `$eq:${inventoryId}`,
                },
            });
        } else */
        const items = await this.inventoryService.findAllEquipmentItems({
            path: '',
            filter: {
                'equpmentItem.bodyPart': `$eq:${currentSlot}`,
                inventory_id: `$eq:${inventory.id}`,
            },
        });

        let caption = '';
        if (items.data.length == 0) {
            caption = 'У вас нет экипировки подходящего типа!';
        } else {
            caption = 'Теперь выберите предмет, который вы хотите надеть:\n';
            items.data.map((item, index) => {
                caption += `${index + 1})${item.equpmentItem.name}\n`;
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
