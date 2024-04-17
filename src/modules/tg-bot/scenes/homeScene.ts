import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { TgBotService } from '../services/tg-bot.service';
import { BotContext } from '../interfaces/bot.context';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { SceneIds } from '../constants/scenes.id';
import { UseFilters } from '@nestjs/common';

import {
    HELLO_IMAGE_PATH,
    SPIRITS_IMAGE_PATH,
    STATIC_IMAGE_BASE_PATH,
} from '../constants/images';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../constants/actions';
import { SpiritService } from '../../spirits/service/spirit.service';

@Scene(SceneIds.home)
@UseFilters(TelegrafExceptionFilter)
export class HomeScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly spiritsService: SpiritService
    ) {}

    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Привет, путник!';
        ctx.sendPhoto(
            {
                source: HELLO_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([
                    [
                        BUTTON_ACTIONS.profile,
                        BUTTON_ACTIONS.ORGANIZATIONS,
                        BUTTON_ACTIONS.map,
                    ],
                    [BUTTON_ACTIONS.allDevils, BUTTON_ACTIONS.allSpirits],
                    [BUTTON_ACTIONS.quests, BUTTON_ACTIONS.help],
                    [BUTTON_ACTIONS.ADMIN_PANEL],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.ORGANIZATIONS)
    async armedForces(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }

    @Hears(BUTTON_ACTIONS.ADMIN_PANEL)
    async admin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.ADMIN);
    }
    @Hears(BUTTON_ACTIONS.profile)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
    @Hears(BUTTON_ACTIONS.map)
    async map(@Ctx() ctx: BotContext) {
        ctx.reply('Карта пока выключена');
        //  await ctx.scene.enter(SceneIds.map);
    }

    @Hears(BUTTON_ACTIONS.allDevils)
    async devils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allDevils);
    }

    @Hears(BUTTON_ACTIONS.allSpirits)
    async spirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allSpirits);
   }

    @Hears(BUTTON_ACTIONS.quests)
    async quests(@Ctx() ctx: BotContext) {
        ctx.reply('У вас нет квестов');
    }
    @Hears(BUTTON_ACTIONS.help)
    async help(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.help);
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
