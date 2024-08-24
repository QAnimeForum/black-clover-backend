import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';

import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { GrmoireWorkerService } from 'src/modules/grimoire/services/grimoire.worker.service';

import { UserService } from 'src/modules/user/services/user.service';
import { UseFilters, Inject } from '@nestjs/common';
import {
    ENUM_ACTION_NAMES,
    GRIMOIRE_NEXT_PAGE_REGEX,
    GRIMOIRE_PREVIOUS_PAGE_REGEX,
} from 'src/modules/tg-bot/constants/action-names.constant';
import {
    TOWER_WORKERS_BUTTON,
    GRIMOIRE_REQUEST_BUTTON,
    GRIMOIRE_LIST_BUTTON,
    FIND_GRIMOIRE_BY_TG_BUTTON,
    BACK_BUTTON,
    ADD_TOWER_WORKERS_BUTTON,
    REMOVE_TOWER_WORKERS_BUTTON,
    CHANGE_GRIMOIRE_STATUS,
    EDIT_MAGIC_NAME_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { GRIMOIRE_TOWER_PATH } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import {
    grimoireToText,
    grimoireAdminInlineKeyboard,
    spellToText,
    convertGrimoiresToTextAndInlineButtons,
} from 'src/modules/tg-bot/utils/grimoire.utils';
import { Markup } from 'telegraf';
import { Logger } from 'typeorm';

@Scene(ENUM_SCENES_ID.ADMIN_GRIMOIRES_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminGrimoireScene {
    constructor(
        private readonly grimoireService: GrimoireService,
        private readonly grmoireWorkerService: GrmoireWorkerService,
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        if (ctx.session.adminGrimoireId) {
            const character = await this.grimoireService.findGrimoireById(
                ctx.session.adminGrimoireId
            );
            const caption = grimoireToText(character);
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(grimoireAdminInlineKeyboard()),
            });
        } else if (ctx.session.adminSpellId) {
            const spell = await this.grimoireService.findSpellById(
                ctx.session.adminSpellId
            );
            const caption = spellToText(spell);
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(
                    []
                    //       spellEditInlineKeyboard(ctx.session.spellId)
                ),
            });
        } else {
            const caption = 'Админская панель';
            await ctx.reply(caption, {
                ...Markup.keyboard([
                    [TOWER_WORKERS_BUTTON, GRIMOIRE_REQUEST_BUTTON],
                    [GRIMOIRE_LIST_BUTTON, FIND_GRIMOIRE_BY_TG_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            });
        }
    }
    @Hears(GRIMOIRE_REQUEST_BUTTON)
    async grimoireRequest(@Ctx() ctx: BotContext, @Sender() sender) {
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        const requests = await this.grimoireService.findAllGrimoireRequests({
            path: '',
        });
        const buttons = [];
        let caption = '<strong>Заявки</strong>\n';

        requests.data.map((request, index) => {
            caption += `${index + 1}) @${request.tgUsername} <code>${request.tgUserId}</code> ${request.magicName}\n`;
            buttons.push([
                Markup.button.callback(
                    `Запрос ${index + 1}`,
                    `REQUEST_ACTION:${request.id}`
                ),
            ]);
        });
        await ctx.replyWithHTML(caption, Markup.inlineKeyboard(buttons));
    }

    @Action(/^(REQUEST_ACTION.*)$/)
    async request(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        const id = ctx.callbackQuery['data'].split(':')[1];
        const request = await this.grimoireService.findGrimoireRequest(id);
        console.log(request);
        const caption = `<strong></strong> ${request.tgUsername} <code>${request.tgUserId}</code> ${request.magicName}\n`;
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Принять заявку',
                        `ACCEPT_REQUEST:${id}`
                    ),
                ],
                [Markup.button.callback(BACK_BUTTON, 'BACK_TO_REQUESTS')],
            ]),
        });
    }
    @Action(/^(ACCEPT_REQUEST.*)$/)
    async acceptRequest(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        ctx.session.grimoireRequestId = ctx.callbackQuery['data'].split(':')[1];
        await ctx.scene.enter(ENUM_SCENES_ID.ACCPEPT_GRIMOIRE_REQUEST_SCENE_ID);
    }
    @Action('BACK_TO_REQUESTS')
    async backToRequestList(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        const requests = await this.grimoireService.findAllGrimoireRequests({
            path: '',
        });
        const buttons = [];
        let caption = '';

        requests.data.map((request, index) => {
            caption += `${index + 1}) ${request.tgUsername} <code>${request.tgUserId}</code> ${request.magicName}\n`;
            buttons.push([
                Markup.button.callback(
                    `Запрос ${index + 1}`,
                    `REQUEST_ACTION:${request.id}`
                ),
            ]);
        });
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Hears(TOWER_WORKERS_BUTTON)
    async workers(@Ctx() ctx: BotContext, @Sender() sender) {
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        const grimoireWorkers =
            await this.grmoireWorkerService.findAllGrimoireWorkers({
                path: '',
            });
        let caption = '<strong>Сотрудники башни гримуаров</strong>\n';
        grimoireWorkers.data.map((worker, index) => {
            caption += `${index + 1}) Имя: ${worker.character.background.name}, ID: <code>${worker.character.user.tgUserId}</code>\n`;
        });

        if (grimoireWorkers.data.length == 0) {
            caption +=
                'В башне никто пока не работает, большое упущение!\nВы можете добавить новых работников\n';
        }

        await ctx.replyWithPhoto(
            {
                source: GRIMOIRE_TOWER_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            ADD_TOWER_WORKERS_BUTTON,
                            ENUM_ACTION_NAMES.ADD_TOWER_WORKERS_ACTION
                        ),
                    ],
                    [
                        Markup.button.callback(
                            REMOVE_TOWER_WORKERS_BUTTON,
                            ENUM_ACTION_NAMES.REMOVE_TOWER_WORKERS_ACTION
                        ),
                    ],
                ]),
            }
        );
    }
    @Hears(GRIMOIRE_LIST_BUTTON)
    @Action(BACK_BUTTON)
    async findByGrimoireList(@Ctx() ctx: BotContext, @Sender() sender) {
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        let page = 1;
        if (ctx.callbackQuery) {
            ctx.answerCbQuery();
            page = ctx.callbackQuery['data'].split(':')[1];
        }

        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
            limit: 5,
            page: page,
            filter: {
                grimoire: '$not:$null',
            },
        });
        const [text, buttons] =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        await ctx.deleteMessage();
        await ctx.replyWithPhoto(
            {
                source: GRIMOIRE_TOWER_PATH,
            },
            {
                caption: text,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(GRIMOIRE_NEXT_PAGE_REGEX)
    async nextPage(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);

        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
            limit: 5,
            page: page,
            filter: {
                grimoire: '$not:$null',
            },
        });
        const [text, buttons] =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        await ctx.editMessageCaption(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(GRIMOIRE_PREVIOUS_PAGE_REGEX)
    async previousPage(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);

        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
            limit: 5,
            page: page,
            filter: {
                grimoire: '$not:$null',
            },
        });
        const [text, buttons] =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        await ctx.editMessageCaption(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(ENUM_ACTION_NAMES.ADD_TOWER_WORKERS_ACTION)
    async addWorker(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_WORKER_ADD_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.REMOVE_TOWER_WORKERS_ACTION)
    async removeWorker(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_WORKER_REMOVE_SCENE_ID);
    }
    @Action(/^(GRIMOIRE.*)$/)
    async showGrimoire(@Ctx() ctx: BotContext, @Sender() sender) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const isAdmin = await this.userService.isAdmin(
                sender.id.toString()
            );
            if (!isAdmin) {
                await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
                return;
            }
            const selectedGrimoireId = ctx.callbackQuery.data.split(':')[1];
            ctx.session.adminGrimoireId = selectedGrimoireId;
            const character =
                await this.grimoireService.findGrimoireById(selectedGrimoireId);
            const caption = grimoireToText(character);
            await ctx.editMessageCaption(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(grimoireAdminInlineKeyboard()),
            });
        }
    }
    @Action(/^(SPELL.*)$/)
    async showSpell(@Ctx() ctx: BotContext, @Sender() sender) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const isAdmin = await this.userService.isAdmin(
                sender.id.toString()
            );
            if (!isAdmin) {
                await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
                return;
            }
            const selectedSpellId = ctx.callbackQuery.data.split(':')[1];
            ctx.session.adminSpellId = selectedSpellId;
            const spell = await this.grimoireService.findSpellById(
                ctx.session.adminSpellId
            );
            const caption = spellToText(spell);
            await ctx.editMessageCaption(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(
                    []
                    //spellEditInlineKeyboard(ctx.session.adminGrimoireId)
                ),
            });
        }
    }

    @Action(CHANGE_GRIMOIRE_STATUS)
    async changeGrimoreStatus(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.CHANGE_GRIMOIRE_STATUS_SCENE_ID);
    }
    @Action(EDIT_MAGIC_NAME_BUTTON)
    async editMagicName(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_MAGIC_NAME_SCENE_ID);
    }
    @Action('BACK_TO_GRIMOIRE')
    async backToGrimoire(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.session.adminSpellId == null;
        const character = await this.grimoireService.findGrimoireById(
            ctx.session.adminGrimoireId
        );
        const caption = grimoireToText(character);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(grimoireAdminInlineKeyboard()),
        });
    }
    @Hears(FIND_GRIMOIRE_BY_TG_BUTTON)
    async findByTgId(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.session.adminGrimoireId = null;
        ctx.session.adminSpellId = null;
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        await ctx.scene.enter(ENUM_SCENES_ID.FIND_GRIMOIRE_BY_TG_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        ctx.session.adminGrimoireId = null;
        ctx.session.adminSpellId = null;
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
