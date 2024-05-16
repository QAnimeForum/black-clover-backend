import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
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
import { DevilsService } from '../../../devils/services/devils.service';
import { ENUM_DEVIL_FLOOR } from '../../../devils/constants/devil.floor.enum';
import { ENUM_DEVIL_RANK } from '../../../devils/constants/devil.ranks.enum';
import { DevilEntity } from '../../../devils/entity/devil.entity';
import { DevilUnionEntity } from '../../../devils/entity/devil.union.entity';

async function devilsList(
    ctx: BotContext,
    devils: Array<DevilEntity>,
    caption: string
) {
    // ctx.deleteMessage(ctx.callbackQuery.message.message_id);

    const devils_buttons = devils.map((item) => [
        Markup.button.callback(`${item.name}`, `devil_id:${item.id}`),
    ]);

    await ctx.replyWithPhoto(
        { source: DEVILS_QLIPOTH_IMAGE_PATH },
        {
            caption: caption,
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(devils_buttons),
        }
    );
}
@Scene(SceneIds.allDevils)
@UseFilters(TelegrafExceptionFilter)
export class AllDevilsScene {
    constructor() {}

    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        ctx.scene.session.devil_list = {
            type: '',
            devil_id: '',
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

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_TYPE_SORT_FLOOR)
    async floor(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allDevilsByFloor);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_TYPE_SORT_RANK)
    async rank(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allDevilsByRank);
    }
}
@Scene(SceneIds.allDevilsByRank)
@UseFilters(TelegrafExceptionFilter)
export class AllDevilsByRankScene {
    constructor(private readonly devilService: DevilsService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        ctx.scene.session.devil_list = {
            type: '',
            devil_id: '',
        };
        await ctx.replyWithPhoto(
            { source: DEVILS_IMAGE_PATH },
            {
                caption: `Информация по дьяволам`,
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

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allDevils);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_TYPE_SORT_RANK)
    async rank(@Ctx() ctx: BotContext) {
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
    }

    @Hears(BUTTON_ACTIONS.DEVIL_RANK_1)
    async highest(@Ctx() ctx: BotContext) {
        ctx.scene.session.devil_list.type = BUTTON_ACTIONS.DEVIL_RANK_1;
        const devils = await this.devilService.findByRank(
            ENUM_DEVIL_RANK.HIGHEST
        );
        devilsList(ctx, devils, `Список высших дьяволов`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_RANK_2)
    async high(@Ctx() ctx: BotContext) {
        ctx.scene.session.devil_list.type = BUTTON_ACTIONS.DEVIL_RANK_2;
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.HIGH);
        devilsList(ctx, devils, `Список высокоранговых дьяволов`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_RANK_4)
    async mid(@Ctx() ctx: BotContext) {
        ctx.scene.session.devil_list.type = BUTTON_ACTIONS.DEVIL_RANK_3;
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.MID);
        devilsList(ctx, devils, `Список среднеранговых дьяволов`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_RANK_4)
    async low(@Ctx() ctx: BotContext) {
        ctx.scene.session.devil_list.type = BUTTON_ACTIONS.DEVIL_RANK_4;
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.LOW);
        devilsList(ctx, devils, `Список низкоранговых дьяволов`);
    }

    @Action(/^(devil_id.*)$/)
    async devil(@Ctx() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query':
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const devil_id = ctx.callbackQuery.data.split(':')[1];
                    ctx.scene.session.devil_list.devil_id = devil_id;
                    const devil_information =
                        await this.devilService.findDevilByIdWithUnions(
                            devil_id
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
                                        `SHOW_ALL_DEVIL_UNIONS:${devil_id}`
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
                } //else ctx.scene.leave();
            /*   case 'message':
                ctx.scene.leave();
            case 'inline_query':
                ctx.scene.leave();*/
        }
    }
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
                    console.log(devil_information);
                    const union_10 = await this.devilService.findSpellsByUnion(
                        devil_information.union_10.id
                    );
                    showSpellInfo(union_10, ctx);
                    const union_25 = await this.devilService.findSpellsByUnion(
                        devil_information.union_25.id
                    );
                    showSpellInfo(union_25, ctx);
                    const union_50 = await this.devilService.findSpellsByUnion(
                        devil_information.union_50.id
                    );
                    showSpellInfo(union_50, ctx);

                    const union_65 = await this.devilService.findSpellsByUnion(
                        devil_information.union_65.id
                    );
                    showSpellInfo(union_65, ctx);

                    const union_80 = await this.devilService.findSpellsByUnion(
                        devil_information.union_80.id
                    );
                    showSpellInfo(union_80, ctx);

                    const union_100 = await this.devilService.findSpellsByUnion(
                        devil_information.union_100.id
                    );
                    showSpellInfo(union_100, ctx);
                }
        }
    }
    @Action(`BACK_TO_DEVIL_LIST`)
    async back_to_list(@Ctx() ctx: BotContext) {
        let devils = [];
        console.log(ctx.scene.session.devil_list.type);
        switch (ctx.scene.session.devil_list.type) {
            case BUTTON_ACTIONS.DEVIL_FLOOR_1: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.ONE
                );
                devilsList(ctx, devils, `Список дьяволов c первого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_2: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.TWO
                );
                devilsList(ctx, devils, `Список дьяволов cо второго этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_3: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.THREE
                );
                devilsList(ctx, devils, `Список дьяволов c третьего этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_4: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.FOUR
                );
                devilsList(ctx, devils, `Список дьяволов c четвёртого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_5: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.FIVE
                );
                devilsList(ctx, devils, `Список дьяволов c пятого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_6: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.SIX
                );
                devilsList(ctx, devils, `Список дьяволов c шестого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_7: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.SEVEN
                );
                devilsList(ctx, devils, `Список дьяволов c седьмого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_1: {
                devils = await this.devilService.findByRank(
                    ENUM_DEVIL_RANK.HIGHEST
                );
                devilsList(ctx, devils, `Список высших дьяволов`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_2: {
                devils = await this.devilService.findByRank(
                    ENUM_DEVIL_RANK.HIGH
                );
                devilsList(ctx, devils, `Список высокоранговых дьяволов`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_3: {
                devils = await this.devilService.findByRank(
                    ENUM_DEVIL_RANK.MID
                );
                devilsList(ctx, devils, `Список среднеранговых дьяволов`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_4: {
                devils = await this.devilService.findByRank(
                    ENUM_DEVIL_RANK.LOW
                );
                devilsList(ctx, devils, `Список низших дьяволов`);
                break;
            }
        }
    }
}

@Scene(SceneIds.allDevilsByFloor)
@UseFilters(TelegrafExceptionFilter)
export class AllDevilsByFloorScene {
    constructor(private readonly devilService: DevilsService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
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
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allDevils);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_FLOOR_1)
    async floor1(@Ctx() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.ONE
        );
        devilsList(ctx, devils, `Список дьяволов c первого этажа`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_FLOOR_2)
    async floor2(@Ctx() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.TWO
        );
        devilsList(ctx, devils, `Список дьяволов c второго этажа`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_FLOOR_3)
    async floor3(@Ctx() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.THREE
        );
        devilsList(ctx, devils, `Список дьяволов c третьего этажа`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_FLOOR_4)
    async floor4(@Ctx() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.TWO
        );
        devilsList(ctx, devils, `Список дьяволов c четвёртого этажа`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_FLOOR_5)
    async floor5(@Ctx() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.FIVE
        );
        devilsList(ctx, devils, `Список низкоранговых дьяволов`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_FLOOR_6)
    async floor6(@Ctx() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.SIX
        );
        devilsList(ctx, devils, `Список среднеранговых дьяволов`);
    }

    @Hears(BUTTON_ACTIONS.DEVIL_FLOOR_7)
    async floor7(@Ctx() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.SEVEN
        );
        devilsList(ctx, devils, `Список высокороанговых дьяволов`);
    }

    @Action(/^(devil_id.*)$/)
    async devil(@Ctx() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query':
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const devil_id = ctx.callbackQuery.data.split(':')[1];
                    ctx.scene.session.devil_list = {
                        devil_id: devil_id,
                        type: 'rr',
                    };
                    const devil_information =
                        await this.devilService.findDevilByIdWithUnions(
                            devil_id
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
                                        `Показать информацию о единениях`,
                                        `SHOW_ALL_DEVIL_UNIONS:${devil_id}`
                                    ),
                                ],
                            ]),
                        }
                    );
                }
        }
    }

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
                    showSpellInfo(union_10, ctx);
                    const union_25 = await this.devilService.findSpellsByUnion(
                        devil_information.union_25.id
                    );
                    showSpellInfo(union_25, ctx);
                    const union_50 = await this.devilService.findSpellsByUnion(
                        devil_information.union_50.id
                    );
                    showSpellInfo(union_50, ctx);

                    const union_65 = await this.devilService.findSpellsByUnion(
                        devil_information.union_65.id
                    );
                    showSpellInfo(union_65, ctx);

                    const union_80 = await this.devilService.findSpellsByUnion(
                        devil_information.union_80.id
                    );
                    showSpellInfo(union_80, ctx);

                    const union_100 = await this.devilService.findSpellsByUnion(
                        devil_information.union_100.id
                    );
                    showSpellInfo(union_100, ctx);
                }
        }
    }
    /* @Action(`BACK_TO_DEVIL_LIST`)
    async back_to_list(@Ctx() ctx: BotContext) {
        let devils = [];
        switch (ctx.scene.session.devil_list.type) {
            case BUTTON_ACTIONS.DEVIL_FLOOR_1: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.ONE
                );
                devilsList(ctx, devils, `Список дьяволов c первого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_2: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.TWO
                );
                devilsList(ctx, devils, `Список дьяволов cо второго этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_3: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.THREE
                );
                devilsList(ctx, devils, `Список дьяволов c третьего этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_4: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.FOUR
                );
                devilsList(ctx, devils, `Список дьяволов c четвёртого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_5: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.FIVE
                );
                devilsList(ctx, devils, `Список дьяволов c пятого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_6: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.SIX
                );
                devilsList(ctx, devils, `Список дьяволов c шестого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_FLOOR_7: {
                devils = await this.devilService.findByFloor(
                    ENUM_DEVIL_FLOOR.SEVEN
                );
                devilsList(ctx, devils, `Список дьяволов c седьмого этажа`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_1: {
                devils = await this.devilService.findByRank(
                    ENUM_DEVIL_RANK.HIGHEST
                );
                devilsList(ctx, devils, `Список высших дьяволов`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_2: {
                devils = await this.devilService.findByRank(
                    ENUM_DEVIL_RANK.HIGH
                );
                devilsList(ctx, devils, `Список высокоранговых дьяволов`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_3: {
                devils = await this.devilService.findByRank(
                    ENUM_DEVIL_RANK.MID
                );
                devilsList(ctx, devils, `Список среднеранговых дьяволов`);
                break;
            }
            case BUTTON_ACTIONS.DEVIL_RANK_4: {
                devils = await this.devilService.findByRank(
                    ENUM_DEVIL_RANK.LOW
                );
                devilsList(ctx, devils, `Список низших дьяволов`);
                break;
            }
        }
    }*/
}
async function showSpellInfo(devilUnion: DevilUnionEntity, ctx: BotContext) {
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
/**
 * import {
    Action,
    Context,
    SceneEnter,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import {
    DEVIL_HOSTS_RULES,
    DEVILS_IMAGE_PATH,
    DEVILS_QLIPOTH_IMAGE_PATH,
    LUCIFERO_IMAGE_PATH,
} from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { ENUM_DEVIL_FLOOR } from '../../../devils/constants/devil.floor.enum';
import { ENUM_DEVIL_RANK } from '../../../devils/constants/devil.ranks.enum';
import { DevilsService } from '../../../devils/services/devils.service';
import { DevilEntity } from '../../../devils/entity/devil.entity';
import { LanguageTexts } from '../../constants/language.text.constant';
import { Markup } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';

enum DEVIL_TYPE_SORT {
    rank = 'rank',
    floor = 'floor',
}

enum ENUM_DEVIL_BACK {
    BACK_1 = 'back1',
    BACK_2 = 'back2',
    BACK_3 = 'back3',
    BACK_4 = 'back4',
    BACK_5 = 'back5',
    BACK_6 = 'back6',
    BACK_7 = 'back7',
}

async function devilListType(ctx: BotContext) {
    await ctx.replyWithPhoto(
        { source: DEVILS_IMAGE_PATH },
        {
            caption: `Вы попали в преисподнюю`,
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.url(
                        'Как заключить контракт с дьяволом',
                        DEVIL_HOSTS_RULES
                    ),
                ],
                [
                    Markup.button.callback(
                        'Список всех дьяволов по рангу',
                        DEVIL_TYPE_SORT.rank
                    ),
                ],
                [
                    Markup.button.callback(
                        'Список всех дьяволов по этажу',
                        DEVIL_TYPE_SORT.floor
                    ),
                ],
            ]),
        }
    );
}

async function byfloor(ctx: BotContext) {
    ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    await ctx.replyWithPhoto(
        { source: DEVILS_QLIPOTH_IMAGE_PATH },
        {
            caption: `Список дьяволов по этажам`,
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_floor_1)}`,
                        ALL_DEVILS_ACTIONS.ONE
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_floor_2)}`,
                        ALL_DEVILS_ACTIONS.TWO
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_floor_3)}`,
                        ALL_DEVILS_ACTIONS.THREE
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_floor_4)}`,
                        ALL_DEVILS_ACTIONS.FOUR
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_floor_5)}`,
                        ALL_DEVILS_ACTIONS.FIVE
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_floor_6)}`,
                        ALL_DEVILS_ACTIONS.SIX
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_floor_7)}`,
                        ALL_DEVILS_ACTIONS.SEVEN
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.buttonsBack)}`,
                        ENUM_DEVIL_BACK.BACK_2
                    ),
                ],
            ]),
        }
    );
}
async function byRank(ctx: BotContext) {
    ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    await ctx.replyWithPhoto(
        { source: DEVILS_QLIPOTH_IMAGE_PATH },
        {
            caption: `Список дьяволов по уровням`,
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_rank_1)}`,
                        ALL_DEVILS_ACTIONS.HIGHEST
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_rank_2)}`,
                        ALL_DEVILS_ACTIONS.HIGH
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_rank_3)}`,
                        ALL_DEVILS_ACTIONS.MID
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.devil_rank_4)}`,
                        ALL_DEVILS_ACTIONS.LOW
                    ),
                ],
                [
                    Markup.button.callback(
                        `${ctx.i18n.t(LanguageTexts.buttonsBack)}`,
                        ENUM_DEVIL_BACK.BACK_2
                    ),
                ],
            ]),
        }
    );
}

enum ALL_DEVILS_ACTIONS {
    ONE = 'ONE',
    TWO = 'TWO',
    THREE = 'THREE',
    FOUR = 'FOUR',
    FIVE = 'FIVE',
    SIX = 'SIX',
    SEVEN = 'SEVEN',
    HIGHEST = 'HIGHEST',
    HIGH = 'HIGH',
    MID = 'MID',
    LOW = 'LOW',
}
@Wizard(SceneIds.allDevils)
@UseFilters(TelegrafExceptionFilter)
export class AllDevilsWizard {
    constructor(
        private readonly devilService: DevilsService,
        private readonly tgBotService: TgBotService
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        devilListType(ctx);
    }

    @WizardStep(1)
    @Action(DEVIL_TYPE_SORT.rank)
    async sortByRank(@Context() ctx: BotContext) {
        ctx.session.devils_list = DEVIL_TYPE_SORT.rank;
        byRank(ctx);
        ctx.wizard.next();
    }

    @WizardStep(1)
    @Action(DEVIL_TYPE_SORT.floor)
    async sortByFloor(@Context() ctx: BotContext) {
        ctx.session.devils_list = DEVIL_TYPE_SORT.floor;
        byfloor(ctx);
        ctx.wizard.next();
    }
    @WizardStep(3)
    @Action(ENUM_DEVIL_BACK.BACK_1)
    async rejectSort(@Context() ctx: BotContext) {
        devilListType(ctx);
        ctx.deleteMessage(ctx.callbackQuery.message.message_id);
        ctx.wizard.back();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.ONE)
    async floor1(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.ONE
        );
        devilsList(ctx, devils, `Список дьяволов c первого этажа`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.TWO)
    async floor2(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.TWO
        );
        devilsList(ctx, devils, `Список дьяволов c второго этажа`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.THREE)
    async floor3(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.THREE
        );
        devilsList(ctx, devils, `Список дьяволов c третьего этажа`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.FOUR)
    async floor4(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.TWO
        );
        devilsList(ctx, devils, `Список дьяволов c четвёртого этажа`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.FIVE)
    async floor5(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.FIVE
        );
        devilsList(ctx, devils, `Список низкоранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.SIX)
    async floor6(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.SIX
        );
        devilsList(ctx, devils, `Список среднеранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.SEVEN)
    async floor7(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.SEVEN
        );
        devilsList(ctx, devils, `Список высокороанговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.HIGHEST)
    async highest(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByRank(
            ENUM_DEVIL_RANK.HIGHEST
        );
        devilsList(ctx, devils, `Список высших дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.HIGH)
    async high(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.HIGH);
        devilsList(ctx, devils, `Список высокоранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.MID)
    async mid(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.MID);
        devilsList(ctx, devils, `Список среднеранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.LOW)
    async low(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.LOW);
        devilsList(ctx, devils, `Список низкоранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(4)
    @Action(ENUM_DEVIL_BACK.BACK_2)
    async rejectSort2(@Context() ctx: BotContext) {
        if (ctx.session.devils_list == DEVIL_TYPE_SORT.floor) {
            byfloor(ctx);
        } else if (ctx.session.devils_list == DEVIL_TYPE_SORT.rank) {
            byRank(ctx);
        }
        ctx.wizard.back();
    }
    @WizardStep(4)
    async devil(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const devil_id = ctx.callbackQuery.data;
                    ctx.session.devil_id = devil_id;
                    showDevilInfo(this.devilService, ctx, devil_id);
                    ctx.wizard.next();
                } else await ctx.scene.leave();
                break;
            }
            case 'message': {
                await ctx.scene.leave();
                break;
            }
            case 'inline_query': {
                await ctx.scene.leave();
                break;
            }
        }
    }

    @WizardStep(6)
    @Action(ENUM_DEVIL_BACK.BACK_4)
    async rejectSort4(@Context() ctx: BotContext) {
        console.log();
        showDevilInfo(this.devilService, ctx, ctx.session.devil_id);
        ctx.wizard.back();
    }
}

 */
