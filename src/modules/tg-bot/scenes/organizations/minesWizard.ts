import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { MINES_PATH, STATIC_IMAGE_BASE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { Markup } from 'telegraf';
import { MineService } from '../../../mines/services/mine.service';
import { PaginateQuery } from 'nestjs-paginate';
import { MINE_DEFAULT_PER_PAGE } from 'src/modules/mines/constants/mine.list.constant';

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
        this.showButtonMenu(ctx);
    }

    @Hears(BUTTON_ACTIONS.MINERALS)
    async minerals(@Ctx() ctx: BotContext) {
        /*const [minerals, total] =
            await this.mineralsService.findMineralsNames();*/
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
            this.showMineralInfo(ctx, value);
            switch (action) {
                case 'GET_MINERAL': {
                    break;
                }
                case 'BACK_TO_MINERALS_LIST': {
                    this.showButtonMenu(ctx);
                }
            }
        }
    }

    async showMineralInfo(ctx: BotContext, mineralId: string) {
        const mineral = await this.mineralsService.findMineralById(mineralId);
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
    }
    async showButtonMenu(ctx: BotContext) {
        const query: PaginateQuery = {
            limit: MINE_DEFAULT_PER_PAGE,
            path: '',
        };
        const paginatedMinerals = await this.mineralsService.findAll(query);
        const minerals = paginatedMinerals.data;
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
            Markup.button.callback(
                `${paginatedMinerals.meta.currentPage} из ${paginatedMinerals.meta.totalPages}`,
                `stop`
            ),
            Markup.button.callback('>>', `next`),
        ]);
        ctx.reply('Выберите минерал', {
            ...Markup.inlineKeyboard(inlineButtons),
        });
    }
}
