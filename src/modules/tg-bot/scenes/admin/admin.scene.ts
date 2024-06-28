import {
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Wizard,
    WizardStep,
    Command,
    Action,
} from 'nestjs-telegraf';
import { ADMIN_IMAGE_PATH } from '../../constants/images';

import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { UserService } from 'src/modules/user/services/user.service';

import {
    ANNOUNCEMENTS_BUTTON,
    ARMED_FORCES_BUTTON,
    BACK_BUTTON,
    CHRONICLE_BUTTON,
    GAMES_BUTTON,
    GRIMOIRES_BUTTON,
    ITEMS_BUTTON,
    MAGIC_PARLAMENT_BUTTON,
    MONEY_BUTTON,
    PERMITIONS_BUTTON,
    PLANTS_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AnnouncementService } from 'src/modules/events/services/announcement.service';
import { SquadsService } from 'src/modules/squards/service/squads.service';
@Scene(ENUM_SCENES_ID.ADMIN_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminScene {
    constructor(
        private readonly userService: UserService,
        private readonly announcementService: AnnouncementService,
        private readonly armedForcesService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Админская панель';
        await ctx.sendPhoto(
            {
                source: ADMIN_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([
                    [PERMITIONS_BUTTON, GRIMOIRES_BUTTON, ITEMS_BUTTON],
                    [PLANTS_BUTTON, GAMES_BUTTON, MONEY_BUTTON],
                    [MAGIC_PARLAMENT_BUTTON, ARMED_FORCES_BUTTON],
                    [ANNOUNCEMENTS_BUTTON, CHRONICLE_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }

    @Hears(ARMED_FORCES_BUTTON)
    async armedForces(@Ctx() ctx: BotContext) {
        const armedForces = await this.armedForcesService.findAllArmedForces({
            path: '',
        });
        const inlineKeyboard = [];
        armedForces.data.map((item) =>
            inlineKeyboard.push([
                Markup.button.callback(
                    `${item.name}`,
                    `ARMED_FORCES:${item.id}`
                ),
            ])
        );
        const caption = 'Админка армии';
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(inlineKeyboard),
        });
    }

    @Action(/^(ARMED_FORCES.*)$/)
    async armedForcesSelected(@Ctx() ctx: BotContext) {
        const selectedId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminSelectedArmedForcesId = selectedId;
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ARMED_FORCES_MAGIC_SCENE_ID);
    }

    @Hears(MAGIC_PARLAMENT_BUTTON)
    async magicParlament(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(
            ENUM_SCENES_ID.ADMIN_MAGIC_PARLAMENT_SCENE_SCENE_ID
        );
    }
    @Hears(ITEMS_BUTTON)
    async items(@Ctx() ctx: BotContext) {
        await ctx.reply('Предметы', {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('Список предметов', 'create_item')],
                [Markup.button.callback('Создать предмет', 'create_item')],
                [
                    Markup.button.callback(
                        'Выдать предмет пользователю',
                        'give_item_to_user'
                    ),
                ],
                [
                    Markup.button.callback(
                        'Создать предложение в магазине',
                        'create_offer'
                    ),
                ],
                [
                    Markup.button.callback(
                        'Удалить предложение в магазине',
                        'delete_offer'
                    ),
                ],
            ]),
        });
    }

    @Hears(PLANTS_BUTTON)
    async plants(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.PLANTS_SCENE_ID);
    }
    @Hears(PERMITIONS_BUTTON)
    async permitions(@Ctx() ctx: BotContext) {
        const superAdmins = await this.userService.findOwners();
        const admins = await this.userService.findAdmins();
        let caption = '<strong>Супер админ</strong>\n';
        superAdmins.map(
            (admin, index) => (caption += `${index + 1}) ${admin.tgUserId}\n`)
        );
        caption += '<strong>Список админов:</strong>\n';
        admins.map(
            (admin, index) => (caption += `${index + 1}) ${admin.tgUserId}\n`)
        );
        if (admins.length == 1) {
            caption += 'Админов нет';
        }
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Назначить админа',
                        `ACTION_ADD_ADMIN`
                    ),
                    Markup.button.callback(
                        'Снять админа',
                        `ACTION_DELETE_ADMIN`
                    ),
                ],
            ]),
        });
    }

    @Hears(ANNOUNCEMENTS_BUTTON)
    async annoncements(@Ctx() ctx: BotContext) {
        ctx.reply('Меню по управлению объявлениями', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Создать новое объявление',
                        `ADD_NEW_ANNOUNCEMENT`
                    ),
                ],
                [
                    Markup.button.callback(
                        'Список объявлений',
                        `SHOW_LIST_ANNOUNCEMENTS`
                    ),
                ],
            ]),
        });
    }
    @Action('ADD_NEW_ANNOUNCEMENT')
    async addAnnouncement(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.ANNOUNCEMENT_CREATE_SCENE_ID);
    }

    @Action('SHOW_LIST_ANNOUNCEMENTS')
    async showAnnouncement(@Ctx() ctx: BotContext) {
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
        ctx.reply(caption, {
            ...Markup.inlineKeyboard([buttons]),
        });
    }

    @Hears(MONEY_BUTTON)
    async money(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID);
    }

    @Hears(GRIMOIRES_BUTTON)
    async grimoire(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_GRIMOIRES_SCENE_ID);
    }

    @Hears(CHRONICLE_BUTTON)
    async chronicle(@Ctx() ctx: BotContext) {
        ctx.reply('Меню по управлению объявлениями', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Создать новое событие в хронологии',
                        `ADD_NEW_EVENT`
                    ),
                ],
                [Markup.button.callback('хроника', `SHOW_LIST_EVENTS`)],
            ]),
        });
    }

    @Action('ACTION_ADD_ADMIN')
    async addAdmin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADD_ADMIN_SCENE_ID);
    }

    @Action('ADD_NEW_DRAFT_ANNOUNCEMENT')
    async removeAdmin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.DELETE_ADMIN_SCENE_ID);
    }

    @Hears(GAMES_BUTTON)
    async games(@Ctx() ctx: BotContext) {
        await ctx.reply('ff', {
            ...Markup.keyboard([
                [
                    Markup.button.callback(
                        'Создать игру в казино',
                        'create_game'
                    ),
                    Markup.button.callback(
                        'Удалить игру в казино',
                        'delete_game'
                    ),
                ],
            ]),
        });
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }
}

@Wizard(ENUM_SCENES_ID.ADD_ADMIN_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AddAdminWizard {
    constructor(private readonly userService: UserService) {}
    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `🧟 Введи  ID игрока, которого хотите назначить админом.\n🦝 Если игрока не находит, то ему нужно прописать /start в боте!`,
            Markup.removeKeyboard()
        );
    }

    @Command('cancel')
    async cancel(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
    @On('text')
    @WizardStep(1)
    async getTgId(@Ctx() ctx: BotContext, @Message() message) {
        const isUserExists = await this.userService.exists(message.text);
        console.log(isUserExists);
        if (!isUserExists) {
            ctx.reply(
                'Введен не верный id пользователя! Для отмены нажмите кнопку отменить /cancel'
            );
            ctx.wizard.back();
        } else {
            // this.userService.changeUserRole(message.text, ENUM_ROLE_TYPE.ADMIN);
            await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        }
    }
}

@Wizard(ENUM_SCENES_ID.DELETE_ADMIN_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class DeleteAdminWizard {
    constructor(private readonly userService: UserService) {}

    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `🧟 Введи TRADE ID игрока, которого хотите снять с поста админа.\n🦝 Если игрока не находит, то ему нужно прописать /start в боте!`
        );
    }

    @Command('cancel')
    @WizardStep(1)
    async cancel(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
    @On('text')
    @WizardStep(1)
    async getTgId(@Ctx() ctx: BotContext, @Message() message) {
        console.log(message);
        const isUserExists = await this.userService.exists(message.text);
        if (!isUserExists) {
            ctx.reply(
                'Введен не верный id пользователя! Для отмены нажмите кнопку отменить /cancel'
            );
            ctx.wizard.back();
        }
        // this.userService.changeUserRole(message.text, ENUM_ROLE_TYPE.USER);
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
