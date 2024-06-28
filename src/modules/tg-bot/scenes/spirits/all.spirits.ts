import { Action, Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import {
    SPIRITS_IMAGE_PATH,
    STATIC_IMAGE_BASE_PATH,
} from '../../constants/images';
import { SpiritService } from '../../../spirits/service/spirit.service';
import { PaginateQuery } from 'nestjs-paginate';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import {
    ALL_SPIRITS_BUTTON,
    BACK_BUTTON,
    SPIRITS_LIST_BUTTON,
} from '../../constants/button-names.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Scene(ENUM_SCENES_ID.ALL_SPIRITS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AllSpiritsScene {
    constructor(
        private readonly spiritsService: SpiritService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Информация о духах клевера';
        if (ctx.chat.type == 'private') {
            await ctx.replyWithPhoto(
                { source: SPIRITS_IMAGE_PATH },
                {
                    caption: caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [SPIRITS_LIST_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            await ctx.replyWithPhoto(
                { source: SPIRITS_IMAGE_PATH },
                {
                    caption: caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                SPIRITS_LIST_BUTTON,
                                SPIRITS_LIST_BUTTON
                            ),
                        ],
                    ]),
                }
            );
        }
    }

    @Action(SPIRITS_LIST_BUTTON)
    @Hears(SPIRITS_LIST_BUTTON)
    @Action('BACK_TO_SPIRIT_LIST')
    async showSpiritsInfo(@Ctx() ctx: BotContext) {
        if (ctx.callbackQuery) {
            ctx.answerCbQuery();
            ctx.deleteMessage();
        }
        const query: PaginateQuery = {
            limit: 10,
            path: '',
        };
        const spirits = await this.spiritsService.findAll(query);
        const caption = 'список всех духов мира клевера';

        const spiritButtons = spirits.data.map((item) => [
            Markup.button.callback(
                `${item.name}`,
                `GET_SPIRIT_INFO:${item.id}`
            ),
        ]);
        await ctx.replyWithPhoto(
            { source: SPIRITS_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(spiritButtons),
            }
        );
    }
    @Hears(BACK_BUTTON)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }

    @Action(/^(GET_SPIRIT_INFO.*)$/)
    public async callbackQuery(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            ctx.deleteMessage();
            const [action, value] = ctx.callbackQuery.data.split(':');
            const spirit = await this.spiritsService.findSpiritById(value);
            const title = `<strong><u>Дух ${spirit.name}</u></strong>\n\n`;
            const description = `<strong>Описание</strong> ${spirit.description}`;
            const caption = title + description;
            await ctx.replyWithPhoto(
                {
                    source: `${STATIC_IMAGE_BASE_PATH}/${spirit.image}`,
                },
                {
                    caption: caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                BACK_BUTTON,
                                `BACK_TO_SPIRIT_LIST`
                            ),
                        ],
                    ]),
                }
            );
        }
    }
}
