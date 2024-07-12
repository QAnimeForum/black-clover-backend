import { Action, Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { MINES_PATH, STATIC_IMAGE_BASE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { MineService } from '../../../mines/services/mine.service';
import { PaginateQuery } from 'nestjs-paginate';
import { MINE_DEFAULT_PER_PAGE } from 'src/modules/mines/constants/mine.list.constant';
import {
    BACK_BUTTON,
    MINERALS_BUTTON,
} from '../../constants/button-names.constant';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';

@Scene(ENUM_SCENES_ID.MINES_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MinesScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly mineralsService: MineService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const type = ctx.chat.type;
        if (type == 'private') {
            const caption = 'Шахты';
            ctx.sendPhoto(
                {
                    source: MINES_PATH,
                },
                {
                    caption,
                    ...Markup.keyboard([
                        [MINERALS_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
            await this.showButtonMenu(ctx);
        } else {
            await this.showButtonMenu(ctx);
        }
    }

    @Hears(MINERALS_BUTTON)
    async minerals(@Ctx() ctx: BotContext) {
        /*const [minerals, total] =
            await this.mineralsService.findMineralsNames();*/
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }

    @Action(/^(GET_MINERAL.*)$/)
    async getMeneralInfo(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const [action, value] = ctx.callbackQuery['data'].split(':');
        this.showMineralInfo(ctx, value);
    }

    @Action('BACK_TO_MINERALS_LIST')
    async backToMineralsList(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await this.showButtonMenu(ctx);
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
                            BACK_BUTTON,
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
