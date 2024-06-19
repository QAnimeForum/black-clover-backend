import {
    Action,
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
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
    BACK_BUTTON,
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
} from '../../constants/button-names.constant';
import {
    defilInformationToText,
    devilListToButtons,
} from '../../utils/devil.utils';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

@Scene(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AllDevilsScene {
    constructor(
        private readonly devilService: DevilsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async showEntryButtons(ctx: BotContext) {
        const chatType = ctx.chat.type;
        ctx.scene.session.devilsList = {
            backStatus: ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_HOME,
            sortType: 'rank',
            selectedId: '',
        };
        if (chatType == 'private') {
            await ctx.replyWithPhoto(
                { source: DEVILS_IMAGE_PATH },
                {
                    caption: `Вы попали в преисподнюю`,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [
                            DEVIL_TYPE_SORT_FLOOR_BUTTON,
                            DEVIL_TYPE_SORT_RANK_BUTTON,
                        ],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
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
    async enter(@Ctx() ctx: BotContext) {
        // await this.showEntryButtons(ctx);
        ctx.scene.session.devilsList = {
            backStatus: ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_HOME,
            sortType: 'rank',
            selectedId: '',
        };
        const chatType = ctx.chat.type;
        if (chatType == 'private') {
            await ctx.replyWithPhoto(
                { source: DEVILS_IMAGE_PATH },
                {
                    caption: `Вы попали в преисподнюю`,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [DEVIL_LIST_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
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
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }

    @Action('BACK_TO_SORT')
    @Hears(DEVIL_LIST_BUTTON)
    @Action(DEVIL_LIST_BUTTON)
    async showDevilList(@Ctx() ctx: BotContext) {
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
    @Action(/^(devilId.*)$/)
    public async callbackQuery(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            const selectedId = ctx.callbackQuery.data.split(':')[1];
            ctx.scene.session.devilsList.selectedId = selectedId;

            console.log(ctx.callbackQuery.data);
            console.log(ctx.callbackQuery.data.split(':'));
            console.log(selectedId);

            const devil = await this.devilService.findDevilById(selectedId);
            const caption = defilInformationToText(devil);
            await ctx.deleteMessage();
            await ctx.replyWithPhoto(
                {
                    source: `${STATIC_IMAGE_BASE_PATH}${devil.image}`,
                },
                {
                    caption: caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                `Показать все заклинания`,
                                `SHOW_ALL_DEVIL_UNIONS:${selectedId}`
                            ),
                        ],
                        [
                            Markup.button.callback(
                                BACK_BUTTON,
                                `BACK_TO_DEVIL_LIST`
                            ),
                        ],
                    ]),
                }
            );
        }
    }
}
