import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BAR_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import {
    BACK_BUTTON,
    MENU_BUTTON,
    RECIPIES_BUTTON,
    SELL_INGREDIENTS_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import { MenuService } from 'src/modules/cuisine/service/menu.service';

@Scene(ENUM_SCENES_ID.BAR_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class BarScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly menuService: MenuService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const barId = ctx.session.selectedBarId;
        const bar = await this.menuService.findRestrantMenu(barId);
        let caption = '<strong> ' + bar.name + '</strong>\n\n';
        caption += bar.description;
        if (ctx.chat.type == 'private') {
            await ctx.sendPhoto(
                {
                    source: BAR_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [MENU_BUTTON],
                        [RECIPIES_BUTTON, SELL_INGREDIENTS_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            await ctx.sendPhoto(
                {
                    source: BAR_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                BACK_BUTTON,
                                ENUM_ACTION_NAMES.BACK_TO_SHOPPING_DISTRICT_ACTION
                            ),
                        ],
                    ]),
                }
            );
        }
    }

    @Action(ENUM_ACTION_NAMES.BACK_TO_SHOPPING_DISTRICT_ACTION)
    async backAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.SHOPPING_DISTRICT_SCENE_ID);
    }

    @Hears(MENU_BUTTON)
    async menu(@Ctx() ctx: BotContext) {
        const barId = ctx.session.selectedBarId;
        const bar = await this.menuService.findRestrantMenu(barId);
        const drinksCount = await this.menuService.countDrinkInMenu(barId);
        let caption = '<strong> ' + bar.name + ', Меню</strong>\n\n';
        caption += `<strong>Количество напитков</strong>: ${drinksCount}\n`;

        await ctx.sendPhoto(
            {
                source: BAR_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }

    @Hears(SELL_INGREDIENTS_BUTTON)
    async sellIngredients(@Ctx() ctx: BotContext) {
        const caption = '';
        await ctx.sendPhoto(
            {
                source: BAR_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [MENU_BUTTON],
                    [RECIPIES_BUTTON, SELL_INGREDIENTS_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }

    @Hears(RECIPIES_BUTTON)
    async recipies(@Ctx() ctx: BotContext) {
        const caption = '';
        await ctx.sendPhoto(
            {
                source: BAR_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [MENU_BUTTON],
                    [RECIPIES_BUTTON, SELL_INGREDIENTS_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        ctx.session.selectedBarId = null;
        await ctx.scene.enter(ENUM_SCENES_ID.SHOPPING_DISTRICT_SCENE_ID);
    }
}
