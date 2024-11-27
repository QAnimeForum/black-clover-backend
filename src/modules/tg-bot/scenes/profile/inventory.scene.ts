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
    EQUIPMENT_BUTTON,
    FOOD_BUTTON,
    GEARS_BUTTON,
    INVENTORY_BUTTON,
    MINERALS_BUTTON,
    REAL_ESTATE_BUTTON,
    RECIPIES_BUTTON,
    VEHICLES_BUTTON,
    WORKS_OF_ART_BUTTON,
} from '../../constants/button-names.constant';
import {
    equipmentInlineKeyBoard,
    equipmentToText,
    showInvnentoryStatistics,
} from '../../utils/inventory.utils';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';
import { ENUM_BODY_PART_ENUM } from 'src/modules/items/constants/body.part.enum';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';

@Scene(ENUM_SCENES_ID.INVENTORY_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class InventoryScene {
    constructor(
        private readonly inventoryService: InventoryService,
        private readonly equpmentItemService: EqupmentItemService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const inventory = await this.inventoryService.findInventoryByTgId(
            sender.tgUserId
        );
        await showInvnentoryStatistics(ctx, inventory);
    }
    @Hears(INVENTORY_BUTTON)
    async inventory(@Ctx() ctx: BotContext, @Sender() sender) {
        const inventory = await this.inventoryService.findInventoryByTgId(
            sender.tgUserId
        );
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
        const currentSlot = ENUM_BODY_PART_ENUM.HEADDRESS;
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

    @Action(ENUM_ACTION_NAMES.CHANGE_ACCESSORY_ACTION)
    async changeAccessory(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.ACCESSORY;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_FEET_ACTION)
    async changeFeet(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.FEET;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(ENUM_ACTION_NAMES.CHANGE_VEHICLE_ACTION)
    async changeVehicle(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const tgUserId = ctx.callbackQuery.from.id.toString();
        const currentSlot = ENUM_BODY_PART_ENUM.ACCESSORY;
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }
    async chooseItem(
        ctx: BotContext,
        tgUserId: string,
        currentSlot: ENUM_BODY_PART_ENUM
    ) {
        const inventory =
            await this.inventoryService.findInventoryByTgId(tgUserId);
        const equipment =
            await this.inventoryService.findEquipmentByTgId(tgUserId);
        const items = await this.inventoryService.findAllEquipmentItems({
            inventoryId: inventory.id,
            bodyPart: currentSlot,
            page: 1,
            limit: 15,
            /*    filter: {
                'equpmentItem.bodyPart': `$eq:${currentSlot}`,
                inventory_id: `$eq:${inventory.id}`,
            },*/
        });
        let caption = '';
        const buttons = [];
        if (items.length == 0) {
            caption = 'У вас нет экипировки подходящего типа!';
        } else {
            caption += ` На вас надето: `;
            switch (currentSlot) {
                case ENUM_BODY_PART_ENUM.ARMOR: {
                    if (equipment.armor) {
                        const item = await this.inventoryService.findItem(
                            equipment.armorId
                        );
                        caption += item?.equpmentItem.name ?? '-';
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${ENUM_BODY_PART_ENUM.ARMOR}`
                            ),
                        ]);
                    } else {
                        caption += '-';
                    }
                    break;
                }
                case ENUM_BODY_PART_ENUM.CLOAK: {
                    if (equipment.cloak) {
                        const item = await this.inventoryService.findItem(
                            equipment.cloakId
                        );
                        caption += item?.equpmentItem.name ?? '-';
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${ENUM_BODY_PART_ENUM.CLOAK}`
                            ),
                        ]);
                    } else {
                        caption += '-';
                    }
                    break;
                }
                case ENUM_BODY_PART_ENUM.FEET: {
                    if (equipment.feet) {
                        const item = await this.inventoryService.findItem(
                            equipment.feetId
                        );
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${ENUM_BODY_PART_ENUM.FEET}`
                            ),
                        ]);
                        caption += item?.equpmentItem.name ?? '-';
                    } else {
                        caption += '-';
                    }

                    break;
                }
                case ENUM_BODY_PART_ENUM.GLOVES: {
                    if (equipment.gloves) {
                        const item = await this.inventoryService.findItem(
                            equipment.glovesId
                        );
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${ENUM_BODY_PART_ENUM.GLOVES}`
                            ),
                        ]);
                        caption += item?.equpmentItem.name ?? '-';
                    } else {
                        caption += '-';
                    }

                    break;
                }
                case ENUM_BODY_PART_ENUM.HAND: {
                    if (equipment.leftHand) {
                        const item = await this.inventoryService.findItem(
                            equipment.leftHandId
                        );
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${ENUM_BODY_PART_ENUM.HAND}`
                            ),
                        ]);
                        caption += item?.equpmentItem.name ?? '-';
                    } else {
                        caption += '-';
                    }

                    break;
                }
                case ENUM_BODY_PART_ENUM.TWO_HANDS: {
                    if (equipment.rightHand) {
                        const item = await this.inventoryService.findItem(
                            equipment.leftHandId
                        );
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${ENUM_BODY_PART_ENUM.TWO_HANDS}`
                            ),
                        ]);
                        caption += item?.equpmentItem.name ?? '-';
                    } else {
                        caption += '-';
                    }

                    break;
                }
                case ENUM_BODY_PART_ENUM.HEADDRESS: {
                    if (equipment.headdress) {
                        const item = await this.inventoryService.findItem(
                            equipment.headdressId
                        );
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${ENUM_BODY_PART_ENUM.HEADDRESS}`
                            ),
                        ]);
                        caption += item?.equpmentItem.name ?? '-';
                    } else {
                        caption += '-';
                    }

                    break;
                }
                case ENUM_BODY_PART_ENUM.ACCESSORY: {
                    if (equipment.accessory) {
                        const item = await this.inventoryService.findItem(
                            equipment.accessoryId
                        );
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${ENUM_BODY_PART_ENUM.ACCESSORY}`
                            ),
                        ]);
                        caption += item?.equpmentItem.name ?? '-';
                    } else {
                        caption += '-';
                    }
                    break;
                }
                case ENUM_BODY_PART_ENUM.FEET: {
                    if (equipment.feet) {
                        const item = await this.inventoryService.findItem(
                            equipment.feetId
                        );
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${equipment.id}:${ENUM_BODY_PART_ENUM.FEET}`
                            ),
                        ]);
                        caption += item?.equpmentItem.name ?? '-';
                    } else {
                        caption += '-';
                    }
                    break;
                }
                /**
              *    case ENUM_BODY_PART_ENUM.VEHICLE: {
                    if (equipment.vehicle) {
                        const item = await this.inventoryService.findItem(
                            equipment.vehicleId
                        );
                        buttons.push([
                            Markup.button.callback(
                                'Снять предмет',
                                `REMOVE_ITEM:${equipment.id}:${ENUM_BODY_PART_ENUM.VEHICLE}`
                            ),
                        ]);
                        caption += item?.name ?? '-';
                    } else {
                        caption += '-';
                    }
              
                    break;
                }
                case ENUM_BODY_PART_ENUM.NO:
                    break;*/
            }
            caption +=
                '\n<strong>Выберите предмет, который вы хотите надеть:</strong>\n';
            items.map((item, index) => {
                //   caption += `${index + 1}) ${item.name}(${item.count})\n`;
                buttons.push([
                    Markup.button.callback(
                        `${item.name}(${item.count})\n`,
                        `ADD_ITEM_TO_SLOT:${item.id}:${currentSlot}`
                    ),
                ]);
            });
        }
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_EQUIP_ITEM
            ),
        ]);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(ADD_ITEM_TO_SLOT:.*)$/)
    async addItemToSlot(@Ctx() ctx: BotContext, @Sender('id') tgUserId) {
        // await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        const currentSlot =
            ENUM_BODY_PART_ENUM[ctx.callbackQuery['data'].split(':')[2]];
        const item = await this.equpmentItemService.findItemById(itemId);
        const equipment =
            await this.inventoryService.findEquipmentByTgId(tgUserId);
        switch (currentSlot) {
            case ENUM_BODY_PART_ENUM.ARMOR: {
                if (equipment?.armor?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            case ENUM_BODY_PART_ENUM.CLOAK: {
                if (equipment?.cloak?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            case ENUM_BODY_PART_ENUM.FEET: {
                if (equipment?.feet?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            case ENUM_BODY_PART_ENUM.GLOVES: {
                if (equipment?.gloves?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            case ENUM_BODY_PART_ENUM.HAND: {
                if (equipment?.leftHand?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            case ENUM_BODY_PART_ENUM.TWO_HANDS: {
                if (equipment?.leftHand?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
                if (equipment?.rightHand?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            case ENUM_BODY_PART_ENUM.HEADDRESS: {
                if (equipment?.headdress?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            case ENUM_BODY_PART_ENUM.ACCESSORY: {
                if (equipment?.accessory?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            case ENUM_BODY_PART_ENUM.FEET: {
                if (equipment?.feet?.equpmentItem.name == item.name) {
                    await ctx.answerCbQuery(`${item.name} уже экипирован`, {
                        show_alert: true,
                    });
                    return;
                }
            }
            default:
                await ctx.answerCbQuery();

            /**
          *    case ENUM_BODY_PART_ENUM.VEHICLE: {
                if (equipment.vehicle.id == itemId) {
                    await ctx.reply(`уже экипирован`);
                }
                return;
            }
          */
        }
        const result = await this.inventoryService.changeItemInInventory(
            itemId,
            currentSlot,
            equipment
        );
        await this.chooseItem(ctx, tgUserId, currentSlot);
    }

    @Action(/^(REMOVE_ITEM:.*)$/)
    async removeItem(@Ctx() ctx: BotContext, @Sender('id') tgUserId) {
        await ctx.answerCbQuery();
        const currentSlot =
            ENUM_BODY_PART_ENUM[ctx.callbackQuery['data'].split(':')[1]];
        const equipment =
            await this.inventoryService.findEquipmentByTgId(tgUserId);
        await this.inventoryService.changeItemInInventory(
            null,
            currentSlot,
            equipment
        );  
        await this.chooseItem(ctx, tgUserId, currentSlot);
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
    @Hears(WORKS_OF_ART_BUTTON)
    async worksOfArts(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список произведения искусства, которое у вас есть</strong>\n\n';
        const not = 'У вас нет ювелирки';
        const caption = title + not;
        const buttons = [
            [Markup.button.callback('Книги', 'BOOKS_ACTION')],
            [Markup.button.callback('Декор', 'PAINTINGS_ACTION')],
        ];

        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
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

    @Hears(RECIPIES_BUTTON)
    async recipies(@Ctx() ctx: BotContext) {
        const title = '<strong>Инструкции по созданию вещей.</strong>\n\n';
        const not = 'У вас нет инструкций';
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

    @Hears(REAL_ESTATE_BUTTON)
    async realEstate(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список недвижимости, которая у вас есть</strong>\n\n';
        const not = 'У вас нет недвижимости';
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
