import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';

import { GrmoireWorkerService } from 'src/modules/grimoire/services/grimoire.worker.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import { MapService } from 'src/modules/map/service/map.service';
import {
    ENUM_ACTION_NAMES,
    BACK_TO_GRIMOIRE_LIST_REQEX,
    GRIMOIRE_INFO_REGEX,
    GRIMOIRE_NEXT_PAGE_REGEX,
    GRIMOIRE_PREVIOUS_PAGE_REGEX,
} from 'src/modules/tg-bot/constants/action-names.constant';
import {
    GRIMOIRE_GET_BUTTON,
    GRIMOIRE_LIST_BUTTON,
    FIND_GRIMOIRE_BY_TG_BUTTON,
    BACK_BUTTON,
    COME_UP_WITH_MAGICAL_ATTRIBUTE_BUTTON,
    ADMIN_CREATE_GRIMOIRE_BUTTON,
    TOWER_WORKERS_OFFICE_BUTTON,
    ADD_SPELL_BUTTON,
    GRIMOIRE_STATISTICS_BUTTON,
    EDIT_SPELL_COOLDOWN_BUTTON,
    EDIT_SPELL_COST_BUTTON,
    EDIT_SPELL_DESCRIPTION_BUTTON,
    EDIT_SPELL_DURATION_BUTTON,
    EDIT_SPELL_GOALS_BUTTON,
    EDIT_SPELL_MINIMAL_LEVEL_BUTTON,
    EDIT_SPELL_NAME_BUTTON,
    EDIT_SPELL_TYPE_BUTTON,
    EDIT_SPELL_DAMAGE_BUTTON,
    EDIT_SPELL_RANGE_BUTTON,
    EDIT_SPELL_CAST_TIME_BUTTON,
    EDIT_SPELL_CHANGE_STATUS_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_HELP_DOCUMENTATION } from 'src/modules/tg-bot/constants/help.constant';
import { GRIMOIRE_TOWER_PATH } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import {
    charactersToWorkList,
    convertGrimoiresToTextAndInlineButtons,
    grimoireStatisticsToText,
    grimoiresToWorkList,
    grimoireToText,
    myGrimoiresToText,
    spellEditInlineKeyboard,
    spellStatusToText,
    spellToText,
    spellTypeToText,
} from 'src/modules/tg-bot/utils/grimoire.utils';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
@Scene(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class GrimoireTowerScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly grimoireWorkerService: GrmoireWorkerService,
        private readonly grimoireService: GrimoireService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async showEnterMessage(ctx: BotContext, id: number) {
        const isGrimoireWorker =
            await this.grimoireWorkerService.isUserWorkerByTgId(id);
        /* if (isGrimoireWorker && ctx.session.adminGrimoireId !== null) {
            const character = await this.grimoireService.findGrimoireById(
                ctx.session.adminGrimoireId
            );
            await this.showGrimoireForWorker(ctx, character);
        }*/
        let caption =
            '🏰Башня гримуаров\n\n Здесь вы можете получить гримуар и выучить заклинания.\n\n';
        const chatType = ctx.chat.type;
        const grimoireWorkers =
            await this.grimoireWorkerService.findAllGrimoireWorkers({
                path: '',
            });
        const totalGrimoires = await this.grimoireService.countGrimoires();
        caption += '<strong>Сотрудники башни гримуаров</strong>\n';
        grimoireWorkers.data.map((worker, index) => {
            caption += `${index + 1}) ${worker.character.background.name}\n`;
        });
        if (grimoireWorkers.data.length == 0) {
            caption +=
                'В башне никто пока не работает, большое упущение!\nВы можете стать сотрудником башни грумуаров (заявки подаются через админов)\n\n';
        }
        caption += `<strong>Общее количество гримуаров:</strong> ${totalGrimoires}\n\n`;
        if (chatType == 'private') {
            const buttons = [];
            const hasGrimoire = await this.grimoireService.hasGrimoire(id);
            if (!hasGrimoire) {
                buttons.push([GRIMOIRE_GET_BUTTON]);
            }
            buttons.push([GRIMOIRE_LIST_BUTTON, FIND_GRIMOIRE_BY_TG_BUTTON]);
            if (isGrimoireWorker) {
                buttons.push([TOWER_WORKERS_OFFICE_BUTTON, BACK_BUTTON]);
            } else {
                buttons.push([BACK_BUTTON]);
            }
            await ctx.replyWithPhoto(
                {
                    source: GRIMOIRE_TOWER_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard(buttons).resize(),
                }
            );
        } else {
            const buttons = [
                [
                    Markup.button.callback(
                        GRIMOIRE_LIST_BUTTON,
                        ENUM_ACTION_NAMES.GRIMOIRE_LIST_ACTION
                    ),
                ],
            ];
            const hasGrimoire = await this.grimoireService.hasGrimoire(id);
            if (hasGrimoire) {
                buttons.push();
            } else {
                buttons.push([
                    Markup.button.callback(
                        GRIMOIRE_GET_BUTTON,
                        ENUM_ACTION_NAMES.GET_GRIMOIRE_ACTION
                    ),
                ]);
            }
            await ctx.replyWithPhoto(
                {
                    source: GRIMOIRE_TOWER_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard(buttons),
                }
            );
        }
    }
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        if (ctx.session.spellEdit && ctx.session.spellEdit.spellId) {
            const spell = await this.grimoireService.findSpellById(
                ctx.session.spellEdit.spellId
            );
            const caption = spellToText(spell);

            await ctx.replyWithPhoto(
                {
                    source: GRIMOIRE_TOWER_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard(
                        spellEditInlineKeyboard(spell.grimoireId, spell.id)
                    ),
                }
            );
        } else {
            this.showEnterMessage(ctx, sender.id);
        }
    }
    @Hears(FIND_GRIMOIRE_BY_TG_BUTTON)
    async findGrimoireByTgButton(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.FIND_GRIMOIRE_BY_TG_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.GRIMOIRE_LIST_ACTION)
    @Hears(GRIMOIRE_LIST_BUTTON)
    async findByGrimoireList(@Ctx() ctx: BotContext) {
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
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
            ),
        ]);
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

    @Action(BACK_TO_GRIMOIRE_LIST_REQEX)
    async findByGrimoireList1(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
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
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
            ),
        ]);
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

    @Action(ENUM_ACTION_NAMES.GET_GRIMOIRE_ACTION)
    async getGrimoire(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        await this.showChooseMenu(ctx);
    }

    @Action(/^REMOVE_GRIMOIRE_TO_WORK:(.*)/)
    async removeGrimoireToWork(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.answerCbQuery();
        await ctx.answerCbQuery();
        const reservationId = ctx.callbackQuery['data'].split(':')[1];
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        await this.grimoireWorkerService.deleteReservation(reservationId);
        const worker = await this.grimoireWorkerService.findWorkerByCharacterId(
            character.id
        );
        const grimoireReservations =
            await this.grimoireWorkerService.findGrimoireReservations({
                path: '',
                limit: 5,
                page: 1,
                filter: {
                    grimoireWorker: `$eq:${worker.id}`,
                },
            });
        const [problemsText, buttons] = myGrimoiresToText(grimoireReservations);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION
            ),
        ]);
        await ctx.editMessageCaption(
            problemsText,
            Markup.inlineKeyboard(buttons)
        );
    }

    @Action(/^ADD_GRIMOIRE_TO_WORK:(.*)/)
    async addGrimoireToWork(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const grimoireId = ctx.callbackQuery['data'].split(':')[1];
        const workerId = await this.grimoireWorkerService.findWorkerIdByTgId(
            sender.id.toString()
        );
        await this.grimoireWorkerService.createReservation(
            workerId,
            grimoireId
        );
        const paginatedCharacter =
            await this.grimoireService.findGrimoiresWithoutReservation({
                path: '',
                limit: 5,
                page: 1,
            });
        const [text, buttons] = grimoiresToWorkList(paginatedCharacter);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, Markup.inlineKeyboard(buttons));
    }
    @Action(/^GRIMOIRE_INFO:(.*):ADD_GRIMOIRE$/)
    async showGrimoireForAdd(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const selectedGrimoireId = ctx.callbackQuery['data'].split(':')[1];
        // const currentPage = ctx.callbackQuery.data.split(':')[2];
        const currentPage = 1;
        ctx.session.spellEdit.grimoireId == selectedGrimoireId;
        const character =
            await this.grimoireService.findGrimoireById(selectedGrimoireId);
        const caption = grimoireToText(character);
        const buttons = [];
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.GET_GRIMOIRE_TO_WORK_ACTION
            ),
        ]);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^GRIMOIRE_INFO:(.*):MY_GRIMOIRES$/)
    async showMyGrimoiresInfoAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        /* const grimoireReservationId = ctx.callbackQuery['data'].split(':')[1];
        const grimoireReservation =
            await this.grimoireWorkerService.findGrimoireReservationById(
                grimoireReservationId
            );
        const character = await this.grimoireService.findGrimoireById(
            grimoireReservation.grimoireId
        );*/
        const grimoireId = ctx.callbackQuery['data'].split(':')[1];
        const character =
            await this.grimoireService.findGrimoireById(grimoireId);
        ctx.session.spellEdit.grimoireId = character.grimoireId;
        await this.showGrimoireForWorker(ctx, character);
    }
    async showGrimoireForWorker(ctx: BotContext, character: CharacterEntity) {
        const caption = grimoireToText(character);
        const buttons = [];
        ctx.session.spellEdit = {
            grimoireId: character.grimoire.id,
            spellId: null,
        };
        buttons.push([
            Markup.button.callback(
                GRIMOIRE_STATISTICS_BUTTON,
                `GRIMOIRE_STATISTICS_BUTTON:${character.grimoire.id}`
            ),
            Markup.button.callback(ADD_SPELL_BUTTON, ADD_SPELL_BUTTON),
        ]);
        character.grimoire.spells.map((spell, index) => {
            const status = spellStatusToText(spell.status);
            buttons.push([
                Markup.button.callback(
                    `${spell.name}; ${spellStatusToText(spell.status)}; ${spellTypeToText(spell.type)}`,
                    `SPELL:${spell.id}:MY_GRIMOIRES`
                ),
            ]);
        });
        buttons.push([
            Markup.button.url(
                'Требования к гримуару',
                ENUM_HELP_DOCUMENTATION.GRIMOIRE
            ),
            Markup.button.url(
                'Шаблон заклинания',
                ENUM_HELP_DOCUMENTATION.SPELL_TEMPLATE
            ),
        ]);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.MY_GRIMOIRES_ACTION
            ),
        ]);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^GRIMOIRE_STATISTICS_BUTTON:(.*)$/)
    async grimoireStatics(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const grimoireId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.spellEdit.grimoireId = grimoireId;
        const character =
            await this.grimoireService.findGrimoireById(grimoireId);
        const caption = grimoireStatisticsToText(character.grimoire);
        const buttons = [];
        ctx.session.spellEdit = {
            grimoireId: character.grimoire.id,
            spellId: null,
        };
        buttons.push([
            Markup.button.callback(
                'Общая информация',
                `GRIMOIRE_INFO:${character.grimoire.id}:MY_GRIMOIRES`
            ),
            Markup.button.callback(ADD_SPELL_BUTTON, ADD_SPELL_BUTTON),
        ]);
        character.grimoire.spells.map((spell, index) => {
            const status = spellStatusToText(spell.status);
            buttons.push([
                Markup.button.callback(
                    `${spell.name}; ${spellStatusToText(spell.status)}; ${spellTypeToText(spell.type)}`,
                    `SPELL:${spell.id}`
                ),
            ]);
        });
        buttons.push([
            Markup.button.url(
                'Требования к гримуару',
                ENUM_HELP_DOCUMENTATION.GRIMOIRE
            ),
            Markup.button.url(
                'Шаблон заклинания',
                ENUM_HELP_DOCUMENTATION.SPELL_TEMPLATE
            ),
        ]);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.MY_GRIMOIRES_ACTION
            ),
        ]);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(GRIMOIRE_INFO_REGEX)
    async showGrimoire(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const selectedGrimoireId = ctx.callbackQuery['data'].split(':')[1];
        // const currentPage = ctx.callbackQuery.data.split(':')[2];
        const currentPage = 1;
        ctx.session.spellEdit = {
            grimoireId: '',
            spellId: '',
        };
        ctx.session.spellEdit.grimoireId = selectedGrimoireId;
        const character =
            await this.grimoireService.findGrimoireById(selectedGrimoireId);
        const buttons = [];
        character.grimoire.spells.map((spell, index) => {
            const status = spellStatusToText(spell.status);
            buttons.push([
                Markup.button.callback(
                    `${spell.name}; ${spellStatusToText(spell.status)}; ${spellTypeToText(spell.type)}`,
                    `SPELL_INFO:${spell.id}`
                ),
            ]);
        });
        buttons.push([
            Markup.button.url(
                'Требования к гримуару',
                ENUM_HELP_DOCUMENTATION.GRIMOIRE
            ),
            Markup.button.url(
                'Шаблон заклинания',
                ENUM_HELP_DOCUMENTATION.SPELL_TEMPLATE
            ),
        ]);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                `${ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_LIST_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage}`
            ),
        ]);
        const caption = grimoireToText(character);

        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(ADD_SPELL_BUTTON)
    async addSpell(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.CREATE_SPELL_FORM_SCENE_ID);
    }

    @Action(/^SPELL:(.*):MY_GRIMOIRES$/)
    async myGrimoiresForMyWork(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const selectedSpellId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.spellEdit.spellId = selectedSpellId;
        const spell = await this.grimoireService.findSpellById(
            ctx.session.spellEdit.spellId
        );
        const caption = spellToText(spell);

        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(
                spellEditInlineKeyboard(spell.grimoireId, spell.id)
            ),
        });
    }
    @Action(/^(SPELL.*)$/)
    async showSpell(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const selectedSpellId = ctx.callbackQuery.data.split(':')[1];
            ctx.session.spellEdit.spellId = selectedSpellId;
            const spell = await this.grimoireService.findSpellById(
                ctx.session.spellEdit.spellId
            );
            const caption = spellToText(spell);

            await ctx.editMessageCaption(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            `GRIMOIRE_INFO:${spell.grimoireId}`
                        ),
                    ],
                ]),
            });
        }
    }

    @Action(/^DELETE_SPELL:(.*)$/)
    async deleteSpell(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const selectedSpellId = ctx.callbackQuery['data'].split(':')[1];
        const spell = await this.grimoireService.findSpellById(selectedSpellId);
        await this.grimoireService.deleteSpell(selectedSpellId);
        const character = await this.grimoireService.findGrimoireById(
            spell.grimoireId
        );
        await this.showGrimoireForWorker(ctx, character);
        /**
       *   ctx.reply('Вы точно хотите удалить заклинание?', {
            ...Markup.inlineKeyboard([[Markup.button.callback('Да', '')]]),
        });
       */
    }
    @Action(GRIMOIRE_NEXT_PAGE_REGEX)
    async nextPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const data = ctx.callbackQuery['data'].split(':');
        const page = Number.parseInt(data[1]);
        const paginatedCharacters = await this.grimoireService.findAllGrimoires(
            {
                path: '',
                limit: 5,
                page: page,
                filter: {
                    grimoire: '$not:$null',
                },
            }
        );
        let text = '';
        let buttons = [];
        if (data.length >= 3) {
            const tab = data[2];
            [text, buttons] = charactersToWorkList(paginatedCharacters);
        } else {
            [text, buttons] =
                convertGrimoiresToTextAndInlineButtons(paginatedCharacters);
        }
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(GRIMOIRE_PREVIOUS_PAGE_REGEX)
    async previousPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
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
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION)
    async backToGrimoireTower(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.answerCbQuery();
        await ctx.deleteMessage();
        this.showEnterMessage(ctx, sender.id);
    }
    @Action(BACK_BUTTON)
    async grimoireList(@Ctx() ctx: BotContext) {
        if (ctx.callbackQuery) {
            ctx.answerCbQuery();
        }
        ctx.session.spellEdit.spellId == null;
        ctx.session.spellEdit.grimoireId == null;
        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
        });
        const [text, buttons] =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        await ctx.editMessageText(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Hears(GRIMOIRE_GET_BUTTON)
    public async wantGrimoire(@Ctx() ctx: BotContext) {
        const isExist = await this.grimoireService.isRequestExist(
            ctx.message.from.id.toString()
        );
        if (isExist) {
            await ctx.reply('Заявка уже принята, к вам придут.');
        } else {
            await this.showChooseMenu(ctx);
        }
    }

    showChooseMenu = async (ctx: BotContext) => {
        await ctx.replyWithPhoto(
            {
                source: GRIMOIRE_TOWER_PATH,
            },
            {
                caption: 'Способы получить гримуар',
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.url(
                            'Система гримуаров',
                            ENUM_HELP_DOCUMENTATION.GRIMOIRE
                        ),
                    ],
                    [
                        Markup.button.callback(
                            COME_UP_WITH_MAGICAL_ATTRIBUTE_BUTTON,
                            ENUM_ACTION_NAMES.COME_UP_WITH_MAGICAL_ATTRIBUTE_ACTION
                        ),
                    ],
                    [
                        Markup.button.callback(
                            ADMIN_CREATE_GRIMOIRE_BUTTON,
                            ENUM_ACTION_NAMES.ADMIN_CREATE_GRIMOIRE_ACTION
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
                        ),
                    ],
                ]),
            }
        );
    };

    @Action(ENUM_ACTION_NAMES.COME_UP_WITH_MAGICAL_ATTRIBUTE_ACTION)
    async comeUpWithMagicalAttribute(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const isExist = await this.grimoireService.isRequestExist(
            ctx.callbackQuery.from.id.toString()
        );
        if (isExist) {
            await ctx.reply('Заявка уже принята, к вам придут.');
        } else {
            await ctx.scene.enter(
                ENUM_SCENES_ID.COME_UP_WITH_MAGICAL_ATTRIBUTE_SCENE_ID
            );
        }
    }

    @Action(ENUM_ACTION_NAMES.ADMIN_CREATE_GRIMOIRE_ACTION)
    async adminCreateGrimoire(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const isExist = await this.grimoireService.isRequestExist(
            ctx.callbackQuery.from.id.toString()
        );
        if (isExist) {
            await ctx.reply('Заявка уже принята, к вам придут.');
        } else {
            await this.grimoireService.createGrimoireRequest(
                ctx.callbackQuery.from.id.toString(),
                ctx.callbackQuery.from.username,
                'на ваше усмотрение'
            );
            await ctx.reply('Небеса услышали вас и скоро с вами свяжутся. ');
        }
    }

    @Hears(TOWER_WORKERS_OFFICE_BUTTON)
    async officeHears(@Ctx() ctx: BotContext) {
        await ctx.sendPhoto(
            {
                source: GRIMOIRE_TOWER_PATH,
            },
            {
                caption: 'Офис башни гримуаров.',
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Мои текущие гримуары',
                            ENUM_ACTION_NAMES.MY_GRIMOIRES_ACTION
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Взять гримуар в работу',
                            ENUM_ACTION_NAMES.GET_GRIMOIRE_TO_WORK_ACTION
                        ),
                    ],
                ]),
            }
        );
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION)
    async officeAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.editMessageCaption(
            'Офис башни гримуаров.',
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Мои текущие гримуары',
                        ENUM_ACTION_NAMES.MY_GRIMOIRES_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Взять гримуар в работу',
                        ENUM_ACTION_NAMES.GET_GRIMOIRE_TO_WORK_ACTION
                    ),
                ],
            ])
        );
    }
    @Action(ENUM_ACTION_NAMES.MY_GRIMOIRES_ACTION)
    async myGrimoires(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.answerCbQuery();
        ctx.session.spellEdit = {
            grimoireId: null,
            spellId: null,
        };
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.grimoireWorkerService.findWorkerByCharacterId(
            character.id
        );
        const grimoireReservations =
            await this.grimoireWorkerService.findGrimoireReservations({
                path: '',
                limit: 5,
                page: 1,
                filter: {
                    grimoireWorker: `$eq:${worker.id}`,
                },
            });
        const [text, buttons] = myGrimoiresToText(grimoireReservations);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, Markup.inlineKeyboard(buttons));
    }

    @Action(/^(MY_GRIMOIRES_NEXT.*)$/)
    async nextPageMyGrimoires(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const data = ctx.callbackQuery['data'].split(':');
        const page = Number.parseInt(data[1]);
        ctx.session.spellEdit = {
            grimoireId: null,
            spellId: null,
        };
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.grimoireWorkerService.findWorkerByCharacterId(
            character.id
        );
        const grimoireReservations =
            await this.grimoireWorkerService.findGrimoireReservations({
                path: '',
                limit: 5,
                page: page,
                filter: {
                    grimoireWorker: `$eq:${worker.id}`,
                },
            });
        const [text, buttons] = myGrimoiresToText(grimoireReservations);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, Markup.inlineKeyboard(buttons));
    }

    @Action(/^(MY_GRIMOIRES_PREVIOUS.*)$/)
    async previousPageMyGrimoires(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);

        ctx.session.spellEdit = {
            grimoireId: null,
            spellId: null,
        };
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.grimoireWorkerService.findWorkerByCharacterId(
            character.id
        );
        const grimoireReservations =
            await this.grimoireWorkerService.findGrimoireReservations({
                path: '',
                limit: 5,
                page: page,
                filter: {
                    grimoireWorker: `$eq:${worker.id}`,
                },
            });
        const [text, buttons] = myGrimoiresToText(grimoireReservations);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, Markup.inlineKeyboard(buttons));
    }

    @Action(ENUM_ACTION_NAMES.GET_GRIMOIRE_TO_WORK_ACTION)
    async getGrimoireToWork(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.answerCbQuery();
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const paginatedCharacter =
            await this.grimoireService.findGrimoiresWithoutReservation({
                path: '',
                limit: 5,
                page: 1,
            });
        const [text, buttons] = grimoiresToWorkList(paginatedCharacter);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, Markup.inlineKeyboard(buttons));
    }

    @Action(/^(GRIMOIRES_TO_WORK_NEXT.*)$/)
    async nextPageToWork(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const data = ctx.callbackQuery['data'].split(':');
        const page = Number.parseInt(data[1]);
        console.log(page);
        const paginatedCharacter =
            await this.grimoireService.findGrimoiresWithoutReservation({
                path: '',
                limit: 5,
                page: page,
            });
        const [text, buttons] = grimoiresToWorkList(paginatedCharacter);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, Markup.inlineKeyboard(buttons));
    }

    @Action(/^(GRIMOIRES_TO_WORK_PREVIOUS.*)$/)
    async previousPageToWork(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);

        const paginatedCharacter =
            await this.grimoireService.findGrimoiresWithoutReservation({
                path: '',
                limit: 5,
                page: page,
            });
        const [text, buttons] = grimoiresToWorkList(paginatedCharacter);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_OFFICE_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, Markup.inlineKeyboard(buttons));
    }

    @Action(EDIT_SPELL_NAME_BUTTON)
    async editSpellName(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_NAME_SCENE_ID);
    }
    @Action(EDIT_SPELL_DESCRIPTION_BUTTON)
    async editSpellDescription(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_DESCRIPTION_SCENE_ID);
    }

    @Action(EDIT_SPELL_RANGE_BUTTON)
    async editSpellRange(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_RANGE_SCENE_ID);
    }
    @Action(EDIT_SPELL_TYPE_BUTTON)
    async editSpellType(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_TYPE_SCENE_ID);
    }

    @Action(EDIT_SPELL_DAMAGE_BUTTON)
    async editSpellDamage(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_DAMAGE_SCENE_ID);
    }

    @Action(EDIT_SPELL_COST_BUTTON)
    async editSpellCost(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_COST_SCENE_ID);
    }

    @Action(EDIT_SPELL_DURATION_BUTTON)
    async editSpellDuration(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_DURATION_SCENE_ID);
    }

    @Action(EDIT_SPELL_COOLDOWN_BUTTON)
    async editSpellCooldown(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_COOLDOWN_SCENE_ID);
    }

    @Action(EDIT_SPELL_GOALS_BUTTON)
    async editSpellGoals(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_GOALS_SCENE_ID);
    }

    @Action(EDIT_SPELL_CAST_TIME_BUTTON)
    async editSpellCastTime(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_CAST_TIME_SCENE_ID);
    }

    @Action(EDIT_SPELL_MINIMAL_LEVEL_BUTTON)
    async editSpellMinLevel(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_MINIMAL_LEVEL_SCENE_ID);
    }

    @Action(EDIT_SPELL_CHANGE_STATUS_BUTTON)
    async changeSpellStatus(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_CHANGE_STATUS_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        ctx.session.spellEdit = null;
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}
