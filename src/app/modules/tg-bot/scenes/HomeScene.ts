import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TgBotService } from '../services/tg-bot.service';
import { BotContext } from '../interfaces/bot.context';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { SceneIds } from '../constants/scenes.id';
import { UseFilters } from '@nestjs/common';

import { HELLO_IMAGE_PATH } from '../constants/images';
import { UserService } from '../../user/services/user.service';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../constants/actions';

@Scene(SceneIds.home)
@UseFilters(TelegrafExceptionFilter)
export class HomeScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly userService: UserService
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
                        BUTTON_ACTIONS.ARMED_FORCES,
                        BUTTON_ACTIONS.map,
                    ],
                    [BUTTON_ACTIONS.allDevils, BUTTON_ACTIONS.allSpirits],
                    [BUTTON_ACTIONS.quests, BUTTON_ACTIONS.help],
                    [BUTTON_ACTIONS.ADMIN_PANEL],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.ARMED_FORCES)
    async armedForces(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.armedForces);
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
        await ctx.scene.enter(SceneIds.map);
    }

    @Hears(BUTTON_ACTIONS.allDevils)
    async devils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allDevils);
    }

    @Hears(BUTTON_ACTIONS.allSpirits)
    async spirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allSpirits);
    }

    @Hears(BUTTON_ACTIONS.profile)
    async quests(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.quests);
    }
    @Hears(BUTTON_ACTIONS.help)
    async help(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.help);
    }
}
