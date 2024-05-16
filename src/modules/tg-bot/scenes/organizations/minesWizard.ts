import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { MINES_PATH, STATIC_IMAGE_BASE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { Markup } from 'telegraf';
import { MineService } from '../../../jobs/mines/services/mine.service';

@Scene(SceneIds.mines)
@UseFilters(TelegrafExceptionFilter)
export class MinesScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly mineralsService: MineService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Шахты';
        ctx.sendPhoto(
            {
                source: MINES_PATH,
            },
            {
                caption,
                ...Markup.keyboard([
                    [BUTTON_ACTIONS.MINERALS],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.MINERALS)
    async minerals(@Ctx() ctx: BotContext) {
        const [minerals, total] =
            await this.mineralsService.findMineralsNames();
        const inlineButtons = [];
        for (let i = 0; i < minerals.length - 1; i += 2) {
            inlineButtons.push([
                Markup.button.callback(
                    minerals[i].name,
                    `GET_MINERAL:${minerals[i].id}`
                ),
                Markup.button.callback(
                    minerals[i + 1].name,
                    `GET_MINERAL:${minerals[i + 1].id}`
                ),
            ]);
        }
        inlineButtons.push([
            Markup.button.callback('1 из 1', `stop`),
            Markup.button.callback('>>', `next`),
        ]);
        ctx.reply('Выберите минерал', {
            ...Markup.inlineKeyboard(inlineButtons),
        });
    }
    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }

    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        if ('data' in ctx.callbackQuery) {
            const [action, value] = ctx.callbackQuery.data.split(':');
            switch (action) {
                case 'GET_MINERAL': {
                    const mineral =
                        await this.mineralsService.findMineralById(value);
                    const title = `<strong><u>Минерал ${mineral.name}</u></strong>\n\n`;
                    const description = `<strong>Описание</strong>\n ${mineral.description}`;
                    const caption = title + description;
                    await ctx.replyWithPhoto(
                        {
                            source: `${STATIC_IMAGE_BASE_PATH}/${mineral.image}`,
                        },
                        {
                            caption: caption,
                            parse_mode: 'HTML',
                            ...Markup.inlineKeyboard([
                                [
                                    Markup.button.callback(
                                        BUTTON_ACTIONS.back,
                                        `BACK_TO_MINERALS_LIST`
                                    ),
                                ],
                            ]),
                        }
                    );
                    break;
                }
                case 'BACK_TO_MINERALS_LIST': {
                    const [minerals, total] =
                        await this.mineralsService.findMineralsNames();
                    const inlineButtons = [];
                    for (let i = 0; i < minerals.length - 1; i += 2) {
                        inlineButtons.push([
                            Markup.button.callback(
                                minerals[i].name,
                                `GET_MINERAL:${minerals[i].id}`
                            ),
                            Markup.button.callback(
                                minerals[i + 1].name,
                                `GET_MINERAL:${minerals[i + 1].id}`
                            ),
                        ]);
                    }
                    inlineButtons.push([
                        Markup.button.callback('1 из 1', `stop`),
                        Markup.button.callback('>>', `next`),
                    ]);
                    ctx.reply('Выберите минерал', {
                        ...Markup.inlineKeyboard(inlineButtons),
                    });
                }
            }
        }
    }
}
