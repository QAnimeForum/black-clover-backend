import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
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
        /* await ctx.reply(
            { source: SPIRITS_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([BACK_BUTTON]),
            }
        );*/
        /* await ctx.replyWithPhoto(
            { source: SPIRITS_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(spirit_buttons),
            }
        );*/
        /* await ctx.replyWithPhoto(
            { source: SPIRITS_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(spirit_buttons),
            }
        );*/

        const caption = '';
        await ctx.replyWithPhoto(
            { source: SPIRITS_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [ALL_SPIRITS_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }

    @Hears(ALL_SPIRITS_BUTTON)
    async showSpiritsInfo(@Ctx() ctx: BotContext) {
        const query: PaginateQuery = {
            limit: 10,
            path: '',
        };

        const spirits = await this.spiritsService.findAll(query);
        const caption = 'список всех духов мира клевера';

        const spirit_buttons = spirits.data.map((item) => [
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
                ...Markup.inlineKeyboard(spirit_buttons),
            }
        );
    }
    @Hears(BACK_BUTTON)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }

    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            const [action, value] = ctx.callbackQuery.data.split(':');
            switch (action) {
                case 'GET_SPIRIT_INFO': {
                    const spirit =
                        await this.spiritsService.findSpiritById(value);
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
                        }
                    );
                }
            }
        }
    }
}