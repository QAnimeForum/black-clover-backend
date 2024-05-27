import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
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
    BACKGROUND_BUTTON,
    FOOD_BUTTON,
    GEARS_BUTTON,
    GRIMOIRE_BUTTON,
    INVENTORY_BUTTON,
    JEWEIRY_BUTTON,
    MINERALS_BUTTON,
    MY_DEVILS_BUTTON,
    MY_SPIRITS_BUTTON,
    PARAMS_BUTTON,
    VEHICLES_BUTTON,
    WALLET_BUTTON,
    WEAPONS_BUTTON,
} from '../../constants/button-names.constant';

@Scene(ENUM_SCENES_ID.INVENTORY_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class InventoryScene {
    constructor(
        private readonly inventoryService: InventoryService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Ваш инвентарь';
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback(MINERALS_BUTTON, MINERALS_BUTTON)],
                ]),
            }
        );
    }
    /**
 * 
 * @param ctx                 ...Markup.keyboard([
                    [BUTTON_ACTIONS.MINERALS, BUTTON_ACTIONS.JEWEIRY],
                    [BUTTON_ACTIONS.FOOD, BUTTON_ACTIONS.ALCOHOL],
                    [BUTTON_ACTIONS.WEAPONS, BUTTON_ACTIONS.ARMOR],
                    [BUTTON_ACTIONS.GEARS, BUTTON_ACTIONS.VEHICLES],
                    [BUTTON_ACTIONS.ALL_INVENTORY],
                    [BACK_BUTTON],
                ]).resize(),
 */
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
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }
    @Hears(GRIMOIRE_BUTTON)
    async grimoire(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_SCENE_ID);
    }
    @Hears(BACKGROUND_BUTTON)
    async bio(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
    }
    @Hears(PARAMS_BUTTON)
    async params(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CHARACTER_PARAMETERS_SCENE_ID);
    }
    @Hears(WALLET_BUTTON)
    async wallet(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.WALLET_SCENE_ID);
    }
    @Hears(INVENTORY_BUTTON)
    async inventory(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.INVENTORY_SCENE_ID);
    }
    @Hears(MY_DEVILS_BUTTON)
    async myDevils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MY_DEVILS_SCENE_ID);
    }

    @Hears(MY_SPIRITS_BUTTON)
    async mySpirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MY_SPIRITS_SCENE_ID);
    }
}
