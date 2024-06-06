import { Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { BotContext } from '../interfaces/bot.context';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { Inject, UseFilters } from '@nestjs/common';

import { HELLO_IMAGE_PATH } from '../constants/images';
import { Markup } from 'telegraf';
import { UserService } from 'src/modules/user/services/user.service';
import { AllowedRoles } from '../common/decorators/allowed-roles.decorator';
import { ENUM_ROLE_TYPE } from 'src/modules/user/constants/role.enum.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from '../constants/scenes.id.enum';
import {
    ADMIN_PANEL_BUTTON,
    ALL_DEVILS_BUTTON,
    ALL_SPIRITS_BUTTON,
    ANNOUNCEMENTS_BUTTON,
    HELP_BUTTON,
    MAP_BUTTON,
    ORGANIZATIONS_BUTTON,
    PROFILE_BUTTON,
    QUESTS_BUTTON,
} from '../constants/button-names.constant';

@Scene(ENUM_SCENES_ID.HOME_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class HomeScene {
    constructor(
        private readonly userSerivce: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async enter(@Ctx() ctx: BotContext, @Sender('id') tgId: string) {
        const isShowAdminButton =
            await this.userSerivce.isShowAdminButton(tgId);
        const caption = 'Привет, путник!';
        ctx.reply(
            `Поздравляем! Вы заполнили базовую информацию о персонаже. \n Для того, чтобы принимать активное участие в мире клевера, вам необходимо иметь гримуар. Перейдите во вкладку`
        );
        const buttons = [
            [PROFILE_BUTTON, ORGANIZATIONS_BUTTON, MAP_BUTTON],
            [ALL_SPIRITS_BUTTON, ALL_DEVILS_BUTTON],
            [ANNOUNCEMENTS_BUTTON, QUESTS_BUTTON, HELP_BUTTON],
            [ADMIN_PANEL_BUTTON]
        ];
        if (isShowAdminButton) {
            buttons.push([ADMIN_PANEL_BUTTON]);
        }
        console.log(buttons);
        ctx.sendPhoto(
            {
                source: HELLO_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }

    @Hears(ORGANIZATIONS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async armedForces(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }

    @Hears(ADMIN_PANEL_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.ADMIN)
    async admin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
    @Hears(PROFILE_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
    @Hears(MAP_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async map(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MAP_SCENE_ID);
    }

    @Hears(ALL_DEVILS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async devils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ALL_SPIRITS_SCENE_ID);
    }

    @Hears(ALL_SPIRITS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async spirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ALL_SPIRITS_SCENE_ID);
    }

    @Hears(ANNOUNCEMENTS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async quests(@Ctx() ctx: BotContext) {
        ctx.reply('У вас нет квестов');
    }
    @Hears(HELP_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async help(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HELP_SCENE_ID);
    }
}

/**
 *   @On('callback_query')
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
 */
