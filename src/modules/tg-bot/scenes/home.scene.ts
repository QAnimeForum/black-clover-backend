import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
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
import { AnnouncementService } from 'src/modules/events/services/announcement.service';

@Scene(ENUM_SCENES_ID.HOME_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class HomeScene {
    constructor(
        private readonly userSerivce: UserService,
        private readonly announcementService: AnnouncementService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async enter(@Ctx() ctx: BotContext, @Sender('id') tgId: string) {
        const chatType = ctx.chat.type;
        const isShowAdminButton = await this.userSerivce.isAdmin(tgId);
        const caption = 'Привет, путник!';
        if (chatType == 'private') {
            const caption = 'Привет, путник!';
            const buttons = [
                [PROFILE_BUTTON, ORGANIZATIONS_BUTTON, MAP_BUTTON],
                [ALL_SPIRITS_BUTTON, ALL_DEVILS_BUTTON],
                [ANNOUNCEMENTS_BUTTON, QUESTS_BUTTON, HELP_BUTTON],
            ];
            if (isShowAdminButton) {
                buttons.push([ADMIN_PANEL_BUTTON]);
            }
            await ctx.sendPhoto(
                {
                    source: HELLO_IMAGE_PATH,
                },
                {
                    caption,
                    ...Markup.keyboard(buttons).resize(),
                }
            );
        } else {
            const buttons = [
                [
                    Markup.button.callback(
                        ORGANIZATIONS_BUTTON,
                        ORGANIZATIONS_BUTTON
                    ),
                    Markup.button.callback(MAP_BUTTON, MAP_BUTTON),
                ],
                [
                    Markup.button.callback(
                        ALL_SPIRITS_BUTTON,
                        ALL_SPIRITS_BUTTON
                    ),
                    Markup.button.callback(
                        ALL_DEVILS_BUTTON,
                        ALL_DEVILS_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        ANNOUNCEMENTS_BUTTON,
                        ANNOUNCEMENTS_BUTTON
                    ),
                    Markup.button.callback(PROFILE_BUTTON, PROFILE_BUTTON),
                ],
            ];

            await ctx.sendPhoto(
                {
                    source: HELLO_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard(buttons),
                }
            );
        }
    }

    @Hears(ORGANIZATIONS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async organizations(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }

    @Action(ORGANIZATIONS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async actionOrganizations(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }

    @Hears(ADMIN_PANEL_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.ADMIN)
    async admin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
    @Hears(PROFILE_BUTTON)
    @Action(PROFILE_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
    @Hears(MAP_BUTTON)
    @Action(MAP_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async map(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.MAP_SCENE_ID);
    }

    @Hears(ALL_DEVILS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async hearDevils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
    }

    @Action(ALL_DEVILS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async actionDevils(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
    }

    @Hears(ALL_SPIRITS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async hearsSpirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ALL_SPIRITS_SCENE_ID);
    }

    @Action(ALL_SPIRITS_BUTTON)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async actionSpirit(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.ALL_SPIRITS_SCENE_ID);
    }

    @Hears(ANNOUNCEMENTS_BUTTON)
    @Action(ANNOUNCEMENTS_BUTTON)
    async quests(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        const announcements =
            await this.announcementService.findAllAnnouncements({
                path: '',
            });
        const caption = `Объявления\n Общее количество объявлений: ${announcements.meta.totalItems}`;
        const buttons = [];
        announcements.data.map((announcement, index) =>
            buttons.push([
                Markup.button.callback(
                    announcement.title,
                    `ANNOUNCEMENTS:${announcement.id}`
                ),
            ])
        );
        if (buttons.length > 0) {
            await ctx.reply(caption, {
                ...Markup.inlineKeyboard([buttons]),
            });
        } else {
            await ctx.reply('Объявлений нет');
        }
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
