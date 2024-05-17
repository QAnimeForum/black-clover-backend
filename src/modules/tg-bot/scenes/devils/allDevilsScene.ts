import {
    Action,
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
} from 'nestjs-telegraf';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';
import {
    DEVILS_IMAGE_PATH,
    DEVILS_QLIPOTH_IMAGE_PATH,
    STATIC_IMAGE_BASE_PATH,
} from '../../constants/images';
import { DEVIL_DEFAULT_PER_PAGE } from 'src/modules/devils/constants/devil.list.constant';
import { ENUM_DEVIL_FLOOR } from 'src/modules/devils/constants/devil.floor.enum';
import { DevilsService } from 'src/modules/devils/services/devils.service';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { DevilEntity } from 'src/modules/devils/entity/devil.entity';
import { DevilUnionEntity } from 'src/modules/devils/entity/devil.union.entity';
import { ENUM_DEVIL_LIST_BACK_TYPE } from '../../interfaces/bot.wizard.session';
import { ENUM_DEVIL_RANK } from 'src/modules/devils/constants/devil.ranks.enum';

@Scene(SceneIds.allDevils)
@UseFilters(TelegrafExceptionFilter)
export class AllDevilsScene {
    constructor(private readonly devilService: DevilsService) {}

    async showEntryButtons(ctx: BotContext) {
        ctx.scene.session.devilsList = {
            backStatus: ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_HOME,
            selectedId: '',
        };
        await ctx.replyWithPhoto(
            { source: DEVILS_IMAGE_PATH },
            {
                caption: `Вы попали в преисподнюю`,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [
                        BUTTON_ACTIONS.DEVIL_TYPE_SORT_FLOOR,
                        BUTTON_ACTIONS.DEVIL_TYPE_SORT_RANK,
                    ],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        this.showEntryButtons(ctx);
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        const backStatus = ctx.scene.session.devilsList.backStatus;
        switch (backStatus) {
            case ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_HOME: {
                await ctx.scene.enter(SceneIds.home);
                break;
            }
            case ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_SORT_TYPE: {
                await this.showEntryButtons(ctx);
                break;
            }
            case ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_FLOOR: {
                break;
            }
            case ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_RANK: {
                break;
            }
        }
    }

    @Hears(BUTTON_ACTIONS.DEVIL_TYPE_SORT_FLOOR)
    async floor(@Ctx() ctx: BotContext) {
        ctx.scene.session.devilsList.backStatus =
            ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_SORT_TYPE;
        await ctx.replyWithPhoto(
            { source: DEVILS_IMAGE_PATH },
            {
                caption: `Информация о дьяволах, собранная по этажам`,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [
                        BUTTON_ACTIONS.DEVIL_FLOOR_1,
                        BUTTON_ACTIONS.DEVIL_FLOOR_2,
                    ],
                    [
                        BUTTON_ACTIONS.DEVIL_FLOOR_3,
                        BUTTON_ACTIONS.DEVIL_FLOOR_4,
                    ],
                    [
                        BUTTON_ACTIONS.DEVIL_FLOOR_5,
                        BUTTON_ACTIONS.DEVIL_FLOOR_6,
                    ],
                    [BUTTON_ACTIONS.DEVIL_FLOOR_7, BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
        // await ctx.scene.enter(SceneIds.allDevilsByFloor);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_TYPE_SORT_RANK)
    async rank(@Ctx() ctx: BotContext) {
        ctx.scene.session.devilsList.backStatus =
            ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_SORT_TYPE;
        await ctx.replyWithPhoto(
            { source: DEVILS_IMAGE_PATH },
            {
                caption: `Список дьяволов по рангам`,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [BUTTON_ACTIONS.DEVIL_RANK_1, BUTTON_ACTIONS.DEVIL_RANK_2],
                    [BUTTON_ACTIONS.DEVIL_RANK_3, BUTTON_ACTIONS.DEVIL_RANK_4],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
        // await ctx.scene.enter(SceneIds.allDevilsByRank);
    }

    @Hears(/(Первый|Второй|Третий|Четвёртый|Пятый|Шестой|Седьмой) этаж/g)
    async floorList(@Ctx() ctx: BotContext, @Message() message) {
        const text = message.text;
        let caption = '';
        const query: PaginateQuery = {
            limit: DEVIL_DEFAULT_PER_PAGE,
            path: '',
            filter: {
                floor: `$eq:${ENUM_DEVIL_FLOOR.ONE}`,
            },
        };
        switch (text) {
            case BUTTON_ACTIONS.DEVIL_FLOOR_1: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.ONE}`,
                };
                caption = 'Список дьяволов первого этажа';
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_2: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.TWO}`,
                };
                caption = 'Список дьяволов второго этажа';
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_3: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.THREE}`,
                };
                caption = 'Список дьяволов третьего этажа';
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_4: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.FOUR}`,
                };
                caption = 'Список дьяволов четвёртого этажа';
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_5: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.FIVE}`,
                };
                caption = 'Список дьяволов пятого этажа';
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_6: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.SIX}`,
                };
                caption = 'Список дьяволов шестого этажа';
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_7: {
                query.filter = {
                    floor: `$eq:${ENUM_DEVIL_FLOOR.SEVEN}`,
                };
                caption = 'Список дьяволов седьмого этажа';
                break;
            }
        }
        const paginatedDevils = await this.devilService.findAll(query);
        this.devilsList(
            ctx,
            paginatedDevils,
            caption,
            ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_FLOOR
        );
    }

    @Hears(/(Высшие|Высокоранговые|Среднеранговые|Низкоранговые|) дьяволы/g)
    async rankList(@Ctx() ctx: BotContext, @Message() message) {
        const text = message.text;
        let caption = '';
        const query: PaginateQuery = {
            limit: DEVIL_DEFAULT_PER_PAGE,
            path: '',
            filter: {
                rank: `$eq:${ENUM_DEVIL_RANK.LOW}`,
            },
        };
        switch (text) {
            case BUTTON_ACTIONS.DEVIL_RANK_1: {
                query.filter = {
                    rank: `$eq:${ENUM_DEVIL_RANK.LOW}`,
                };
                caption = 'Список низкоранговых дьяволов';
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_2: {
                query.filter = {
                    rank: `$eq:${ENUM_DEVIL_RANK.MID}`,
                };
                caption = `Список среднеранговых дьяволов`;
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_3: {
                query.filter = {
                    rank: `$eq:${ENUM_DEVIL_RANK.HIGH}`,
                };
                caption = `Список высокоранговых дьяволов`;
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_4: {
                query.filter = {
                    rank: `$eq:${ENUM_DEVIL_RANK.HIGHEST}`,
                };
                caption = `Список высших дьяволов`;
                break;
            }
        }
        const paginatedDevils = await this.devilService.findAll(query);
        this.devilsList(
            ctx,
            paginatedDevils,
            caption,
            ENUM_DEVIL_LIST_BACK_TYPE.BACK_TO_RANK
        );
    }

    @Action(/^(devil_id.*)$/)
    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            console.log(ctx.callbackQuery);
            const selectedId = ctx.callbackQuery.data.split(':')[1];
            console.log(selectedId);
            ctx.scene.session.devilsList.selectedId = selectedId;
            const devil_information =
                await this.devilService.findDevilByIdWithUnions(selectedId);
            console.log(devil_information);
            const nameBlock = `<strong>Имя</strong>: ${devil_information.name}\n`;
            const floorBLock = `<strong>Этаж</strong>: ${devil_information.floor}\n`;
            const rankBlock = `<strong>Ранг</strong>: ${devil_information.rank}\n`;
            const descriptionBlock = `<strong>Описание</strong>\n${devil_information.description}\n`;
            const caption = `<strong>Профиль дьявола</strong>\n\n${nameBlock}${floorBLock}${rankBlock}${descriptionBlock}`;

            await ctx.replyWithPhoto(
                {
                    source: `${STATIC_IMAGE_BASE_PATH}${devil_information.image}`,
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
                                BUTTON_ACTIONS.back,
                                `BACK_TO_DEVIL_LIST`
                            ),
                        ],
                    ]),
                }
            );
        }
    }
    /**
  * 
  * @param ctx    @Action(/^(devil_id.*)$/)
    async devil(@Ctx() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query':
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const selectedId = ctx.callbackQuery.data.split(':')[1];
                    ctx.scene.session.devilsList.selectedId = selectedId;
                    const devil_information =
                        await this.devilService.findDevilByIdWithUnions(
                            selectedId
                        );
                    const nameBlock = `<strong>Имя</strong>: ${devil_information.name}\n`;
                    const floorBLock = `<strong>Этаж</strong>: ${devil_information.floor}\n`;
                    const rankBlock = `<strong>Ранг</strong>: ${devil_information.rank}\n`;
                    const descriptionBlock = `<strong>Описание</strong>\n${devil_information.description}\n`;
                    const caption = `<strong>Профиль дьявола</strong>\n\n${nameBlock}${floorBLock}${rankBlock}${descriptionBlock}`;

                    await ctx.replyWithPhoto(
                        {
                            source: `${STATIC_IMAGE_BASE_PATH}${devil_information.image}`,
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
                                        BUTTON_ACTIONS.back,
                                        `BACK_TO_DEVIL_LIST`
                                    ),
                                ],
                            ]),
                        }
                    );
                }
        }
    }
  */
    @Action(/^(SHOW_ALL_DEVIL_UNIONS.*)$/)
    async unions(@Ctx() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query':
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const devil_id = ctx.callbackQuery.data.split(':')[1];
                    const devil_information =
                        await this.devilService.findDevilByIdWithUnions(
                            devil_id
                        );
                    const union_10 = await this.devilService.findSpellsByUnion(
                        devil_information.union_10.id
                    );
                    this.showSpellInfo(union_10, ctx);
                    const union_25 = await this.devilService.findSpellsByUnion(
                        devil_information.union_25.id
                    );
                    this.showSpellInfo(union_25, ctx);
                    const union_50 = await this.devilService.findSpellsByUnion(
                        devil_information.union_50.id
                    );
                    this.showSpellInfo(union_50, ctx);

                    const union_65 = await this.devilService.findSpellsByUnion(
                        devil_information.union_65.id
                    );
                    this.showSpellInfo(union_65, ctx);

                    const union_80 = await this.devilService.findSpellsByUnion(
                        devil_information.union_80.id
                    );
                    this.showSpellInfo(union_80, ctx);

                    const union_100 = await this.devilService.findSpellsByUnion(
                        devil_information.union_100.id
                    );
                    this.showSpellInfo(union_100, ctx);
                }
        }
    }

    async devilsList(
        ctx: BotContext,
        devils: Paginated<DevilEntity>,
        caption: string,
        back: ENUM_DEVIL_LIST_BACK_TYPE
    ) {
        // ctx.deleteMessage(ctx.callbackQuery.message.message_id);
        ctx.scene.session.devilsList.backStatus = back;
        const data = devils.data;
        const devilsButtons = data.map((item) => [
            Markup.button.callback(`${item.name}`, `devil_id:${item.id}`),
        ]);
        console.log(devilsButtons);
        await ctx.replyWithPhoto(
            { source: DEVILS_QLIPOTH_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(devilsButtons),
            }
        );
    }

    async showSpellInfo(devilUnion: DevilUnionEntity, ctx: BotContext) {
        const caption = devilUnion.spells
            .map((spell, index) => {
                const title = `<strong><u>Заклинание ${index + 1}</u></strong>\n`;
                const nameBlock = `<strong>Название</strong>: ${spell.name}\n`;
                const costBlock = `<strong>Название</strong>: ${spell.cost}\n`;
                const castTImeBlock = `<strong>Время каста заклинания</strong>: ${spell.castTime}\n`;
                const durationBlock = `<strong>Продолжительность заклинания</strong>: ${spell.duration}\n`;
                const rangeBlock = `<strong>Дальность заклинания</strong>: ${spell.range}\n`;
                const descriptionBlock = `<strong>Описание</strong>\n${spell.description}\n`;
                const caption = `${title}${nameBlock}${costBlock}${castTImeBlock}${durationBlock}${rangeBlock}${descriptionBlock}\n\n`;
                return caption;
            })
            .join('');
        await ctx.reply(`Едиение ${devilUnion.percent}%\n\n${caption}`, {
            parse_mode: 'HTML',
        });
    }
}
