import { Ctx, Hears, Scene, SceneEnter, Action } from 'nestjs-telegraf';
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
    CHARACTERS_BUTTON,
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
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { Paginated } from 'nestjs-paginate';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';
import { ShopService } from 'src/modules/items/service/shop.service';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
@Scene(ENUM_SCENES_ID.ADMIN_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminScene {
    constructor(
        private readonly userService: UserService,
        private readonly equipmentItemService: EqupmentItemService,
        private readonly announcementService: AnnouncementService,
        private readonly shopService: ShopService,
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
                    [CHARACTERS_BUTTON, ITEMS_BUTTON],
                    [MAGIC_PARLAMENT_BUTTON, ARMED_FORCES_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }

    @Hears(CHARACTERS_BUTTON)
    async chracters(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(
            ENUM_SCENES_ID.ADMIN_CHARACTERS_SETTINGS_SCENE_ID
        );
    }
    @Hears(ARMED_FORCES_BUTTON)
    async armedForces(@Ctx() ctx: BotContext) {
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
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
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

export const charactersListButtons = (
    problems: Paginated<CharacterEntity>
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = problems;
    const { currentPage, totalPages, totalItems } = meta;
    let caption = `Судебные дела\n\n Общее количество дел: ${totalItems}`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((character, index) => {
        caption += `${index + 1})${character.background.name} ${character.user.tgUserId} ${character?.grimoire?.magicName ?? ''}\n`;
        buttons.push([
            Markup.button.callback(
                `${index + 1})${character.background.name} ${character.user.tgUserId} ${character?.grimoire?.magicName}\n`,
                `${ENUM_ACTION_NAMES.CHARACTER_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${character.id}${ENUM_ACTION_NAMES.DELIMITER}${ENUM_ACTION_NAMES.BACK_TO_CHARACTER}`
            ),
        ]);
    });
    if (totalPages == 0) {
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && problems.meta.totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.CHARACTER_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.CHARACTER_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(
                `${problems.meta.currentPage} из ${problems.meta.totalPages}`,
                `PAGE`
            ),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.CHARACTER_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.CHARACTER_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    }
    return [caption, buttons];
};
