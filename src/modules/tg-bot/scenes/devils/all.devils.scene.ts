import {
    Action,
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Sender,
} from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import {
    DEVILS_IMAGE_PATH,
    DEVILS_QLIPOTH_IMAGE_PATH,
    STATIC_IMAGE_BASE_PATH,
} from '../../constants/images';
import { DEVIL_DEFAULT_PER_PAGE } from 'src/modules/devils/constants/devil.list.constant';
import { ENUM_DEVIL_FLOOR } from 'src/modules/devils/constants/devil.floor.enum';
import { DevilsService } from 'src/modules/devils/services/devils.service';
import { PaginateQuery } from 'nestjs-paginate';
import { ENUM_DEVIL_LIST_BACK_TYPE } from '../../interfaces/bot.wizard.session';
import { ENUM_DEVIL_RANK } from 'src/modules/devils/constants/devil.ranks.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import {
    ADD_SPELL_BUTTON,
    BACK_BUTTON,
    DELETE_SPELL_BUTTON,
    DEVIL_CREATE_BUTTON,
    DEVIL_FLOOR_1_BUTTON,
    DEVIL_FLOOR_2_BUTTON,
    DEVIL_FLOOR_3_BUTTON,
    DEVIL_FLOOR_4_BUTTON,
    DEVIL_FLOOR_5_BUTTON,
    DEVIL_FLOOR_6_BUTTON,
    DEVIL_FLOOR_7_BUTTON,
    DEVIL_LIST_BUTTON,
    DEVIL_RANK_1_BUTTON,
    DEVIL_RANK_2_BUTTON,
    DEVIL_RANK_3_BUTTON,
    DEVIL_RANK_4_BUTTON,
    DEVIL_TYPE_SORT_FLOOR_BUTTON,
    DEVIL_TYPE_SORT_RANK_BUTTON,
    EDIT_SPELL_CAST_TIME_BUTTON,
    EDIT_SPELL_CHANGE_STATUS_BUTTON,
    EDIT_SPELL_COOLDOWN_BUTTON,
    EDIT_SPELL_COST_BUTTON,
    EDIT_SPELL_DAMAGE_BUTTON,
    EDIT_SPELL_DESCRIPTION_BUTTON,
    EDIT_SPELL_DURATION_BUTTON,
    EDIT_SPELL_GOALS_BUTTON,
    EDIT_SPELL_MINIMAL_LEVEL_BUTTON,
    EDIT_SPELL_NAME_BUTTON,
    EDIT_SPELL_RANGE_BUTTON,
    EDIT_SPELL_TYPE_BUTTON,
} from '../../constants/button-names.constant';
import {
    defilInformationToText,
    devilButtons,
    devilListToButtons,
    devilUnionToText,
} from '../../utils/devil.utils';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';
import {
    convertPercentToValue,
    DevilUnionsPercentEnum,
} from 'src/modules/devils/constants/devil.union.percent.enum';
import { spellToText } from '../../utils/grimoire.utils';

@Scene(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AllDevilsScene {
    constructor(
        private readonly devilService: DevilsService,
        @Inject(UserService) private readonly userService: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async showEntryButtons(ctx: BotContext, @Sender() sender) {
        const chatType = ctx.chat.type;
        ctx.scene.session.devilsList = {
            backStatus: ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_HOME,
            sortType: 'rank',
            selectedId: '',
        };
        if (chatType == 'private') {
            const buttons = [];
            buttons.push([
                [DEVIL_TYPE_SORT_FLOOR_BUTTON, DEVIL_TYPE_SORT_RANK_BUTTON],
                [BACK_BUTTON],
            ]);
            await ctx.replyWithPhoto(
                { source: DEVILS_IMAGE_PATH },
                {
                    caption: `Вы попали в преисподнюю`,
                    parse_mode: 'HTML',
                    ...Markup.keyboard(buttons).resize(),
                }
            );
            if (ctx.session.devilId) {
                const devilId = ctx.session.devilId;
                const devil = await this.devilService.findDevilById(devilId);
                const caption = defilInformationToText(devil);
                const buttons = [
                    [
                        Markup.button.callback(
                            'Редактировать имя',
                            `EDIT_NAME:${devilId}`
                        ),
                        Markup.button.callback(
                            'Редактировать описание',
                            `EDIT_DESCRIPTION:${devilId}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Редактировать этаж',
                            `EDIT_FLOOR:${devilId}`
                        ),
                        Markup.button.callback(
                            'Редактировать ранк',
                            `EDIT_RANK:${devilId}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            `DEVIL_ID:${devilId}`
                        ),
                    ],
                ];
                await ctx.replyWithPhoto(
                    {
                        source: `${STATIC_IMAGE_BASE_PATH}${devil.image}`,
                    },
                    {
                        caption: caption,
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard(buttons),
                    }
                );
            }
            if (ctx.session.editUnionSpellId) {
                const buttons = [];
                const isAdmin = await this.userService.isAdmin(
                    sender.id.toString()
                );
                const union = await this.devilService.findDefaultSpell(
                    ctx.session.editUnionSpellId
                );
                const caption = spellToText(union.spell);
                if (isAdmin) {
                    buttons.push(
                        [
                            Markup.button.callback(
                                DELETE_SPELL_BUTTON,
                                `DELETE_SPELL:${ctx.session.editUnionSpellId}`
                            ),
                        ],
                        [
                            Markup.button.callback(
                                EDIT_SPELL_NAME_BUTTON,
                                EDIT_SPELL_NAME_BUTTON
                            ),
                            Markup.button.callback(
                                EDIT_SPELL_DESCRIPTION_BUTTON,
                                EDIT_SPELL_DESCRIPTION_BUTTON
                            ),
                        ],
                        [
                            Markup.button.callback(
                                EDIT_SPELL_TYPE_BUTTON,
                                EDIT_SPELL_TYPE_BUTTON
                            ),
                            Markup.button.callback(
                                EDIT_SPELL_COST_BUTTON,
                                EDIT_SPELL_COST_BUTTON
                            ),
                        ],
                        [
                            Markup.button.callback(
                                EDIT_SPELL_DURATION_BUTTON,
                                EDIT_SPELL_DURATION_BUTTON
                            ),
                            Markup.button.callback(
                                EDIT_SPELL_COOLDOWN_BUTTON,
                                EDIT_SPELL_COOLDOWN_BUTTON
                            ),
                        ],
                        [
                            Markup.button.callback(
                                EDIT_SPELL_GOALS_BUTTON,
                                EDIT_SPELL_GOALS_BUTTON
                            ),
                            Markup.button.callback(
                                EDIT_SPELL_DAMAGE_BUTTON,
                                EDIT_SPELL_DAMAGE_BUTTON
                            ),
                        ],
                        [
                            Markup.button.callback(
                                EDIT_SPELL_CHANGE_STATUS_BUTTON,
                                EDIT_SPELL_CHANGE_STATUS_BUTTON
                            ),
                            Markup.button.callback(
                                EDIT_SPELL_RANGE_BUTTON,
                                EDIT_SPELL_RANGE_BUTTON
                            ),
                        ],
                        [
                            Markup.button.callback(
                                EDIT_SPELL_CAST_TIME_BUTTON,
                                EDIT_SPELL_CAST_TIME_BUTTON
                            ),
                            Markup.button.callback(
                                BACK_BUTTON,
                                `DEVIL_UNION:${union.devilId}:${union.percent}`
                            ),
                        ]
                    );
                }

                await ctx.editMessageCaption(caption, {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard(buttons),
                });
            }
        } else {
            await ctx.replyWithPhoto(
                { source: DEVILS_IMAGE_PATH },
                {
                    caption: `Вы попали в преисподнюю`,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                DEVIL_TYPE_SORT_FLOOR_BUTTON,
                                DEVIL_TYPE_SORT_FLOOR_BUTTON
                            ),
                        ],
                        [
                            Markup.button.callback(
                                DEVIL_TYPE_SORT_RANK_BUTTON,
                                DEVIL_TYPE_SORT_RANK_BUTTON
                            ),
                        ],
                    ]),
                }
            );
        }
    }
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        // await this.showEntryButtons(ctx);
        ctx.scene.session.devilsList = {
            backStatus: ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_HOME,
            sortType: 'rank',
            selectedId: '',
        };
        const chatType = ctx.chat.type;
        if (chatType == 'private') {
            if (
                ctx.session.devilCreateSpellDto &&
                ctx.session.devilCreateSpellDto.devilId
            ) {
                const devilId = ctx.session.devilCreateSpellDto.devilId;
                const percent = ctx.session.devilCreateSpellDto.percent;
                const unions = await this.devilService.findDefaultSpells({
                    path: '',
                    filter: {
                        devil_id: `$eq:${devilId}`,
                        percent: `$eq:${percent}`,
                    },
                });
                const caption = `Единение ${percent}%`;
                const devil = await this.devilService.findDevilById(devilId);
                const buttons = [
                    [
                        Markup.button.callback(
                            ADD_SPELL_BUTTON,
                            `ADD_SPELL:${devilId}:${percent}`
                        ),
                    ],
                ];
                unions.data.map((union) => {
                    buttons.push([
                        Markup.button.callback(
                            `${union.spell.name}`,
                            `SPELL_BY_UNION:${union.id}`
                        ),
                    ]);
                });
                buttons.push([
                    Markup.button.callback(BACK_BUTTON, `DEVIL_ID:${devilId}`),
                ]);
                await ctx.replyWithPhoto(
                    {
                        source: `${STATIC_IMAGE_BASE_PATH}${devil.image}`,
                    },
                    {
                        caption: caption,
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard(buttons),
                    }
                );
                ctx.session.devilCreateSpellDto.devilId = null;
                ctx.session.devilCreateSpellDto.percent = null;
            } else if (ctx.session.devilId) {
                const devilId = ctx.session.devilId;
                const devil = await this.devilService.findDevilById(devilId);
                const caption = defilInformationToText(devil);
                const isShowAdminButton = await this.userService.isAdmin(
                    sender.id
                );
                const buttons = [
                    [
                        Markup.button.callback(
                            'Редактировать имя',
                            `EDIT_NAME:${devilId}`
                        ),
                        Markup.button.callback(
                            'Редактировать описание',
                            `EDIT_DESCRIPTION:${devilId}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Редактировать этаж',
                            `EDIT_FLOOR:${devilId}`
                        ),
                        Markup.button.callback(
                            'Редактировать ранк',
                            `EDIT_RANK:${devilId}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            `DEVIL_ID:${devilId}`
                        ),
                    ],
                ];
                await ctx.replyWithPhoto(
                    {
                        source: `${STATIC_IMAGE_BASE_PATH}${devil.image}`,
                    },
                    {
                        caption: caption,
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard(buttons),
                    }
                );
            } else {
                const isShowAdminButton = await this.userService.isAdmin(
                    sender.id
                );
                const buttons = [];
                if (isShowAdminButton) {
                    buttons.push([DEVIL_CREATE_BUTTON]);
                }
                buttons.push([DEVIL_LIST_BUTTON]);
                buttons.push([BACK_BUTTON]);
                await ctx.replyWithPhoto(
                    { source: DEVILS_IMAGE_PATH },
                    {
                        caption: `Вы попали в преисподнюю`,
                        parse_mode: 'HTML',
                        ...Markup.keyboard(buttons).resize(),
                    }
                );
            }
        } else {
            await ctx.replyWithPhoto(
                { source: DEVILS_IMAGE_PATH },
                {
                    caption: `Вы попали в преисподнюю`,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                DEVIL_LIST_BUTTON,
                                DEVIL_LIST_BUTTON
                            ),
                        ],
                    ]),
                }
            );
        }
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        ctx.session.devilCreateSpellDto = null;
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }

    @Action('BACK_TO_SORT')
    @Hears(DEVIL_LIST_BUTTON)
    @Action(DEVIL_LIST_BUTTON)
    async showDevilList(@Ctx() ctx: BotContext) {
        ctx.session.devilId = null;
        await ctx.deleteMessage();
        await ctx.replyWithPhoto(
            { source: DEVILS_IMAGE_PATH },
            {
                caption: `Вы попали в преисподнюю`,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            DEVIL_TYPE_SORT_FLOOR_BUTTON,
                            DEVIL_TYPE_SORT_FLOOR_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_TYPE_SORT_RANK_BUTTON,
                            DEVIL_TYPE_SORT_RANK_BUTTON
                        ),
                    ],
                ]),
            }
        );
    }
    @Action(DEVIL_TYPE_SORT_FLOOR_BUTTON)
    @Hears(DEVIL_TYPE_SORT_FLOOR_BUTTON)
    async floor(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        await this.showFlowList(ctx);
    }

    async showFlowList(ctx: BotContext) {
        await ctx.replyWithPhoto(
            {
                source: DEVILS_IMAGE_PATH,
            },
            {
                caption: `Информация о дьяволах, собранная по этажам`,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            DEVIL_FLOOR_1_BUTTON,
                            DEVIL_FLOOR_1_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_FLOOR_2_BUTTON,
                            DEVIL_FLOOR_2_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_FLOOR_3_BUTTON,
                            DEVIL_FLOOR_3_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_FLOOR_4_BUTTON,
                            DEVIL_FLOOR_4_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_FLOOR_5_BUTTON,
                            DEVIL_FLOOR_5_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_FLOOR_6_BUTTON,
                            DEVIL_FLOOR_6_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_FLOOR_7_BUTTON,
                            DEVIL_FLOOR_7_BUTTON
                        ),
                    ],
                    [Markup.button.callback(BACK_BUTTON, 'BACK_TO_SORT')],
                ]),
            }
        );
        //  }
    }
    @Action(DEVIL_TYPE_SORT_RANK_BUTTON)
    @Hears(DEVIL_TYPE_SORT_RANK_BUTTON)
    async rank(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        await this.showRankList(ctx);
    }

    async showRankList(ctx: BotContext) {
        await ctx.replyWithPhoto(
            { source: DEVILS_IMAGE_PATH },
            {
                caption: `Список дьяволов по рангам`,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            DEVIL_RANK_1_BUTTON,
                            DEVIL_RANK_1_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_RANK_2_BUTTON,
                            DEVIL_RANK_2_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_RANK_3_BUTTON,
                            DEVIL_RANK_3_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_RANK_4_BUTTON,
                            DEVIL_RANK_4_BUTTON
                        ),
                    ],
                    [Markup.button.callback(BACK_BUTTON, 'BACK_TO_SORT')],
                ]),
            }
        );
    }
    @Hears(/(Первый|Второй|Третий|Четвёртый|Пятый|Шестой|Седьмой) этаж/g)
    async floorListInline(@Ctx() ctx: BotContext, @Message() message) {
        const text = message.text;
        const [caption, buttons] = await this.showDevilListByFloor(ctx, text);
        console.log(buttons);
        await ctx.replyWithPhoto(
            { source: DEVILS_QLIPOTH_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(/(Первый|Второй|Третий|Четвёртый|Пятый|Шестой|Седьмой) этаж/g)
    async floorListKeyboard(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.session.devilsList.sortType = 'floor';
        const text = ctx.callbackQuery['data'];
        const [caption, buttons] = await this.showDevilListByFloor(ctx, text);
        ctx.deleteMessage();
        await ctx.replyWithPhoto(
            { source: DEVILS_QLIPOTH_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    async showDevilListByFloor(
        ctx: BotContext,
        floor: string
    ): Promise<[string, InlineKeyboardButton[][]]> {
        let caption = '';
        const query: PaginateQuery = {
            limit: DEVIL_DEFAULT_PER_PAGE,
            path: '',
            filter: {
                floor: `$eq:${ENUM_DEVIL_FLOOR.ONE}`,
            },
        };
        switch (floor) {
            case DEVIL_FLOOR_1_BUTTON: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.ONE}`,
                };
                caption = 'Список дьяволов первого этажа';
                break;
            }
            case DEVIL_FLOOR_2_BUTTON: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.TWO}`,
                };
                caption = 'Список дьяволов второго этажа';
                break;
            }
            case DEVIL_FLOOR_3_BUTTON: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.THREE}`,
                };
                caption = 'Список дьяволов третьего этажа';
                break;
            }
            case DEVIL_FLOOR_4_BUTTON: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.FOUR}`,
                };
                caption = 'Список дьяволов четвёртого этажа';
                break;
            }
            case DEVIL_FLOOR_5_BUTTON: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.FIVE}`,
                };
                caption = 'Список дьяволов пятого этажа';
                break;
            }
            case DEVIL_FLOOR_6_BUTTON: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.SIX}`,
                };
                caption = 'Список дьяволов шестого этажа';
                break;
            }
            case DEVIL_FLOOR_7_BUTTON: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.SEVEN}`,
                };
            }
        }
        ctx.session.devilPaginateQuery = query;
        const paginatedDevils = await this.devilService.findAll(query);

        const buttons = devilListToButtons(paginatedDevils, floor);
        return [caption, buttons];
    }

    @Hears(/(Высшие|Высокоранговые|Среднеранговые|Низкоранговые|) дьяволы/g)
    async rankListInline(@Ctx() ctx: BotContext, @Message() message) {
        ctx.scene.session.devilsList.sortType = 'rank';
        const text = message.text;
        const [caption, buttons] = await this.showDevilListByRank(ctx, text);
        await ctx.replyWithPhoto(
            { source: DEVILS_QLIPOTH_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action('BACK_TO_DEVIL_SORT')
    async backToDevilSort(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        if (ctx.scene.session.devilsList.sortType == 'rank') {
            await this.showRankList(ctx);
        } else {
            await this.showFlowList(ctx);
        }
    }
    @Action(/(Высшие|Высокоранговые|Среднеранговые|Низкоранговые|) дьяволы/g)
    async rankListKeyboard(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.session.devilsList.sortType = 'rank';
        const text = ctx.callbackQuery['data'];
        const [caption, buttons] = await this.showDevilListByRank(ctx, text);
        ctx.deleteMessage();
        await ctx.replyWithPhoto(
            { source: DEVILS_QLIPOTH_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    async showDevilListByRank(
        ctx: BotContext,
        rank: string
    ): Promise<[string, InlineKeyboardButton[][]]> {
        let caption = '';
        const query: PaginateQuery = {
            limit: DEVIL_DEFAULT_PER_PAGE,
            path: '',
            filter: {
                rank: `$eq:${ENUM_DEVIL_RANK.LOW}`,
            },
        };
        switch (rank) {
            case DEVIL_RANK_4_BUTTON: {
                query.filter = {
                    rank: `$eq:${ENUM_DEVIL_RANK.LOW}`,
                };
                caption = 'Список низкоранговых дьяволов';
                break;
            }
            case DEVIL_RANK_4_BUTTON: {
                query.filter = {
                    rank: `$eq:${ENUM_DEVIL_RANK.MID}`,
                };
                caption = `Список среднеранговых дьяволов`;
                break;
            }
            case DEVIL_RANK_2_BUTTON: {
                query.filter = {
                    rank: `$eq:${ENUM_DEVIL_RANK.HIGH}`,
                };
                caption = `Список высокоранговых дьяволов`;
                break;
            }
            case DEVIL_RANK_1_BUTTON: {
                query.filter = {
                    rank: `$eq:${ENUM_DEVIL_RANK.HIGHEST}`,
                };
                caption = `Список высших дьяволов`;
                break;
            }
        }
        ctx.session.devilPaginateQuery = query;
        const paginatedDevils = await this.devilService.findAll(query);
        const buttons = devilListToButtons(paginatedDevils, rank);
        return [caption, buttons];
    }
    @Action(/^(DEVILS_NEXT_PAGE.*)$/)
    public async nextPage(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            const page = ctx.callbackQuery.data.split(':')[1];
            ctx.session.devilPaginateQuery.page = Number.parseInt(page);
            const paginatedDevils = await this.devilService.findAll(
                ctx.session.devilPaginateQuery
            );

            const buttons = devilListToButtons(paginatedDevils, '');
            await ctx.editMessageCaption(
                'Список дьяволов',
                Markup.inlineKeyboard(buttons)
            );
        }
    }

    @Action(/^(DEVILS_PREVIOUS_PAGE.*)$/)
    public async previousPage(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            const page = ctx.callbackQuery.data.split(':')[1];
            ctx.session.devilPaginateQuery.page = Number.parseInt(page);
            const paginatedDevils = await this.devilService.findAll(
                ctx.session.devilPaginateQuery
            );

            const buttons = devilListToButtons(paginatedDevils, '');
            await ctx.editMessageCaption(
                'Список дьяволов',
                Markup.inlineKeyboard(buttons)
            );
        }
    }

    @Action('BACK_TO_DEVIL_LIST')
    async backToDevils(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            await ctx.deleteMessage();
            const paginatedDevils = await this.devilService.findAll(
                ctx.session.devilPaginateQuery
            );
            const buttons = devilListToButtons(paginatedDevils, '');

            await ctx.replyWithPhoto(
                {
                    source: DEVILS_IMAGE_PATH,
                },
                {
                    caption: 'Список дьяволов',
                    ...Markup.inlineKeyboard(buttons),
                }
            );
        }
    }
    @Action(/^(DEVIL_ID.*)$/)
    public async callbackQuery(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        if ('data' in ctx.callbackQuery) {
            const selectedId = ctx.callbackQuery.data.split(':')[1];
            ctx.scene.session.devilsList.selectedId = selectedId;

            const devil = await this.devilService.findDevilById(selectedId);
            const caption = defilInformationToText(devil);
            const isShowAdminButton = await this.userService.isAdmin(tgId);
            await ctx.deleteMessage();
            await ctx.replyWithPhoto(
                {
                    source: `${STATIC_IMAGE_BASE_PATH}${devil.image}`,
                },
                {
                    caption: caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard(
                        devilButtons(selectedId, isShowAdminButton)
                    ),
                }
            );
        }
    }

    @Action(/^DEVIL_UNION:(.*)$/)
    async devil10(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.session.editUnionSpellId = null;
        const devilId = ctx.callbackQuery['data'].split(
            ENUM_ACTION_NAMES.DELIMITER
        )[1];
        const percent = ctx.callbackQuery['data'].split(
            ENUM_ACTION_NAMES.DELIMITER
        )[2];
        //const percent = DevilUnionsPercentEnum.PERCENT_10;
        const unions = await this.devilService.findDefaultSpells({
            path: '',
            filter: {
                devil_id: `$eq:${devilId}`,
                percent: `$eq:${percent}`,
            },
        });

        const caption = `Единение ${percent}%`;
        const devil = await this.devilService.findDevilById(devilId);
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        const buttons = [];
        if (isAdmin) {
            buttons.push([
                Markup.button.callback(
                    ADD_SPELL_BUTTON,
                    `ADD_SPELL:${devilId}:${percent}`
                ),
            ]);
        }
        unions.data.map((union) => {
            buttons.push([
                Markup.button.callback(
                    `${union.spell.name}`,
                    `SPELL_BY_UNION:${union.id}`
                ),
            ]);
        });
        buttons.push([
            Markup.button.callback(BACK_BUTTON, `DEVIL_ID:${devilId}`),
        ]);
        await ctx.editMessageCaption(caption, {
            ...Markup.inlineKeyboard(buttons),
        });
        /*await ctx.editMessageCaption(
            caption,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        ADD_SPELL_BUTTON,
                        `ADD_SPELL:${devilId}:${DevilUnionsPercentEnum.PERCENT_10}`
                    ),
                ],
                [Markup.button.callback(BACK_BUTTON, `DEVIL_ID:${devilId}`)],
            ])
        );*/
    }
    @Action(/^SPELL_BY_UNION:(.*)$/)
    async showSpell(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const unionId = await ctx.callbackQuery['data'].split(
            ENUM_ACTION_NAMES.DELIMITER
        )[1];
        const union = await this.devilService.findDefaultSpell(unionId);
        const caption = spellToText(union.spell);
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        ctx.session.editUnionSpellId = unionId;
        const buttons = [];
        if (isAdmin) {
            buttons.push(
                [
                    Markup.button.callback(
                        DELETE_SPELL_BUTTON,
                        `DELETE_SPELL:${union}`
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_SPELL_NAME_BUTTON,
                        EDIT_SPELL_NAME_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_SPELL_DESCRIPTION_BUTTON,
                        EDIT_SPELL_DESCRIPTION_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_SPELL_TYPE_BUTTON,
                        EDIT_SPELL_TYPE_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_SPELL_COST_BUTTON,
                        EDIT_SPELL_COST_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_SPELL_DURATION_BUTTON,
                        EDIT_SPELL_DURATION_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_SPELL_COOLDOWN_BUTTON,
                        EDIT_SPELL_COOLDOWN_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_SPELL_GOALS_BUTTON,
                        EDIT_SPELL_GOALS_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_SPELL_DAMAGE_BUTTON,
                        EDIT_SPELL_DAMAGE_BUTTON
                    ),
                ]
            );
        }
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                `DEVIL_UNION:${union.devilId}:${union.percent}`
            ),
        ]);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^SHOW_ALL_DEVIL_UNIONS:(.*)$/)
    async devilUnions(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        await ctx.answerCbQuery();
        const devilId = await ctx.callbackQuery['data'].split(':')[1];
        const devil = await this.devilService.findDevilById(devilId);
        const caption = devilUnionToText();
        const isShowAdminButton = await this.userService.isAdmin(tgId);
        await ctx.replyWithPhoto(
            {
                source: `${STATIC_IMAGE_BASE_PATH}${devil.image}`,
            },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(
                    devilButtons(devilId, isShowAdminButton)
                ),
            }
        );
    }

    @Action(/^ADD_SPELL:(.*):(.*)$/)
    async addSpell(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const devilId = await ctx.callbackQuery['data'].split(':')[1];
        const persentValue: string =
            await ctx.callbackQuery['data'].split(':')[2];
        const persent = convertPercentToValue(persentValue);
        ctx.session.devilCreateSpellDto = {
            devilId: devilId,
            percent: persent,
        };
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE__DEVIL_SPELL_FORM_SCENE_ID);
    }
    @Action(/^EDIT_INFORMATION:(.*)$/)
    async editInformation(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        await ctx.answerCbQuery();
        const devilId = await ctx.callbackQuery['data'].split(':')[1];
        const devil = await this.devilService.findDevilById(devilId);
        const caption = devilUnionToText();
        const buttons = [
            [
                Markup.button.callback(
                    'Редактировать имя',
                    `EDIT_NAME:${devilId}`
                ),
                Markup.button.callback(
                    'Редактировать описание',
                    `EDIT_DESCRIPTION:${devilId}`
                ),
            ],
            [
                Markup.button.callback(
                    'Редактировать этаж',
                    `EDIT_FLOOR:${devilId}`
                ),
                Markup.button.callback(
                    'Редактировать ранк',
                    `EDIT_RANK:${devilId}`
                ),
            ],
            [Markup.button.callback(BACK_BUTTON, `DEVIL_ID:${devilId}`)],
        ];
        await ctx.editMessageReplyMarkup({
            inline_keyboard: buttons,
        });
    }

    @Action(/^EDIT_NAME:(.*)$/)
    async editDevilName(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const devilId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.devilId = devilId;
        await ctx.scene.enter(ENUM_SCENES_ID.DEVIL_EDIT_NAME_SCENE_ID);
    }

    @Action(/^EDIT_FLOOR:(.*)$/)
    async editDevilFloor(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const devilId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.devilId = devilId;
        await ctx.scene.enter(ENUM_SCENES_ID.DEVIL_EDIT_FLOOR_SCENE_ID);
    }

    @Action(/^EDIT_DESCRIPTION:(.*)$/)
    async editDevilDescription(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const devilId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.devilId = devilId;
        await ctx.scene.enter(ENUM_SCENES_ID.DEVIL_EDIT_DESCRIPTION_SCENE_ID);
    }

    @Action(/^EDIT_RANK:(.*)$/)
    async editDevilRank(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const devilId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.devilId = devilId;
        await ctx.scene.enter(ENUM_SCENES_ID.DEVIL_EDIT_RANK_SCENE_ID);
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
        console.log(ctx.session.editUnionSpellId);
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

    @Action(EDIT_SPELL_MINIMAL_LEVEL_BUTTON)
    async editSpellMinLevel(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_MINIMAL_LEVEL_SCENE_ID);
    }

    @Hears(DEVIL_CREATE_BUTTON)
    async createDevil(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.DEVIL_CREATE_SCENE_ID);
    }
}
