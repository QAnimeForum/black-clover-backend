import {
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
import { ENUM_DEVIL_FLOOR } from 'src/app/modules/devils/constants/devil.floor.enum';
import { ENUM_DEVIL_RANK } from 'src/app/modules/devils/constants/devil.ranks.enum';
import { DevilsService } from 'src/app/modules/devils/services/devils.service';
import { DevilEntity } from 'src/app/modules/devils/entity/devil.entity';
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
                        `${ctx.i18n.t(LanguageTexts.back)}`,
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
                        `${ctx.i18n.t(LanguageTexts.back)}`,
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
        floorList(ctx, devils, `Список дьяволов c первого этажа`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.TWO)
    async floor2(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.TWO
        );
        floorList(ctx, devils, `Список дьяволов c второго этажа`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.THREE)
    async floor3(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.THREE
        );
        floorList(ctx, devils, `Список дьяволов c третьего этажа`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.FOUR)
    async floor4(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.TWO
        );
        floorList(ctx, devils, `Список дьяволов c четвёртого этажа`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.FIVE)
    async floor5(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.FIVE
        );
        floorList(ctx, devils, `Список низкоранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.SIX)
    async floor6(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.SIX
        );
        floorList(ctx, devils, `Список среднеранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.SEVEN)
    async floor7(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByFloor(
            ENUM_DEVIL_FLOOR.SEVEN
        );
        floorList(ctx, devils, `Список высокороанговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.HIGHEST)
    async highest(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByRank(
            ENUM_DEVIL_RANK.HIGHEST
        );
        floorList(ctx, devils, `Список высших дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.HIGH)
    async high(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.HIGH);
        floorList(ctx, devils, `Список высокоранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.MID)
    async mid(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.MID);
        floorList(ctx, devils, `Список среднеранговых дьяволов`);
        ctx.wizard.next();
    }

    @WizardStep(3)
    @Action(ALL_DEVILS_ACTIONS.LOW)
    async low(@Context() ctx: BotContext) {
        const devils = await this.devilService.findByRank(ENUM_DEVIL_RANK.LOW);
        floorList(ctx, devils, `Список низкоранговых дьяволов`);
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

async function floorList(
    ctx: BotContext,
    devils: Array<DevilEntity>,
    caption: string
) {
    ctx.deleteMessage(ctx.callbackQuery.message.message_id);

    const devils_buttons = devils.map((item) => [
        { text: `${item.name}`, callback_data: `${item.id}` },
    ]);
    const buttons = devils_buttons.concat([
        [
            {
                text: ctx.i18n.t(LanguageTexts.back),
                callback_data: ENUM_DEVIL_BACK.BACK_2,
            },
        ],
    ]);
    await ctx.replyWithPhoto(
        { source: DEVILS_QLIPOTH_IMAGE_PATH },
        {
            caption: caption,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: buttons,
            },
        }
    );
}

async function showDevilInfo(
    devilService: DevilsService,
    ctx: BotContext,
    devil_id: string
) {
    const devil_information =
        await devilService.findDevilByIdWithUnions(devil_id);
    const caption = `${ctx.i18n.t(LanguageTexts.devil_info_titles_name)}${devil_information.name}${ctx.i18n.t(LanguageTexts.devil_info_titles_rank)}${devil_information.rank}${ctx.i18n.t(LanguageTexts.devil_info_titles_floor)}${devil_information.floor}${ctx.i18n.t(LanguageTexts.devil_info_titles_magic)}${devil_information.magic_type}${ctx.i18n.t(LanguageTexts.devil_info_titles_description)}${devil_information.description}`;
    await ctx.replyWithPhoto(
        { source: LUCIFERO_IMAGE_PATH },
        {
            caption: caption,
        }
    );
    showSpellInfo(devilService, ctx, devil_information.union_10.id, 10);
    showSpellInfo(devilService, ctx, devil_information.union_25.id, 25);
    showSpellInfo(devilService, ctx, devil_information.union_50.id, 50);
    showSpellInfo(devilService, ctx, devil_information.union_65.id, 65);
    showSpellInfo(devilService, ctx, devil_information.union_80.id, 80);
    showSpellInfo(devilService, ctx, devil_information.union_100.id, 100);
}

async function showSpellInfo(
    devilService: DevilsService,
    ctx: BotContext,
    union_id: string,
    number: number
) {
    const info = await devilService.findSpellsByUnion(union_id);
    const spells = info.spells;
    const caption = spells
        .map(
            (spell) =>
                `${spell.name}${spell.castTime}${spell.cost}${spell.duration}${spell.range}${spell.description}\n\n`
        )
        .join();
    await ctx.reply(`Единение ${number}\n${caption}`);
}
/**
 *     // STEP - 1 start travel
    @WizardStep(1)
    @Action(ENUM_DEVIL_BACK.BACK_1)
    async step1(@Context() ctx: BotContext) {
        devilListType(ctx);
        ctx.wizard.next();
    }

    // STEP - 2 Choose name

    @WizardStep(1)
    async step2(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    if (ctx.callbackQuery.data === ENUM_DEVIL_BACK.BACK_1) {
                        ctx.wizard.back();
                    } else {
                        list1(ctx);
                        ctx.wizard.next();
                    }
                } else ctx.scene.leave();
                break;
            }
            case 'message': {
                ctx.scene.leave();
                break;
            }
            case 'inline_query': {
                ctx.scene.leave();
                break;
            }
        }
    }

    @WizardStep(1)
    @Action(ENUM_DEVIL_BACK.BACK_2)
    async step3(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    if (ctx.callbackQuery.data === ENUM_DEVIL_BACK.BACK_1) {
                        ctx.wizard.back();
                    } else {
                        list1(ctx);
                        ctx.wizard.next();
                    }
                } else ctx.scene.leave();
                break;
            }
            case 'message': {
                ctx.scene.leave();
                break;
            }
            case 'inline_query': {
                ctx.scene.leave();
                break;
            }
        }
    }
    @WizardStep(2)
    async step4(@Context() ctx: BotContext) {
        let devils: Array<DevilEntity> = [];
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    switch (ctx.session.devils_list) {
                        case DEVIL_TYPE_SORT.floor: {
                            devils = await this.devilService.findByFloor(
                                ENUM_DEVIL_FLOOR[ctx.callbackQuery.data]
                            );
                            break;
                        }
                        case DEVIL_TYPE_SORT.rank: {
                            devils = await this.devilService.findByRank(
                                ENUM_DEVIL_RANK[ctx.callbackQuery.data]
                            );
                            break;
                        }
                    }
                        devils = await this.devilService.findByFloor(
                                ENUM_DEVIL_FLOOR[ctx.callbackQuery.data]
                            );
                    const devils_buttons = devils.map((item) => [
                        { text: `${item.name}`, callback_data: `${item.id}` },
                    ]);
                    const buttons = devils_buttons.concat([
                        [
                            {
                                text: ctx.i18n.t(LanguageTexts.back),
                                callback_data: ENUM_DEVIL_BACK.BACK_2,
                            },
                        ],
                    ]);
                    await ctx.replyWithPhoto(
                        { source: DEVILS_QLIPOTH_IMAGE_PATH },
                        {
                            caption: `
                       Список высших дьяволов
                      `,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: buttons,
                            },
                        }
                    );
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

    @WizardStep(3)
    async step5(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const devil_id = ctx.callbackQuery.data;
                    console.log(devil_id);
                    const devil_information =
                        await this.devilService.findDevilByIdWithUnions(
                            devil_id
                        );
                    const caption = `${ctx.i18n.t(LanguageTexts.devil_info_titles_name)}${devil_information.name}${ctx.i18n.t(LanguageTexts.devil_info_titles_rank)}${devil_information.rank}${ctx.i18n.t(LanguageTexts.devil_info_titles_floor)}${devil_information.floor}${ctx.i18n.t(LanguageTexts.devil_info_titles_magic)}${devil_information.magic_type}${ctx.i18n.t(LanguageTexts.devil_info_titles_description)}${devil_information.description}`;
                    console.log(devil_information);
                    await ctx.replyWithPhoto(
                        { source: LUCIFERO_IMAGE_PATH },
                        {
                            caption: caption,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: `${ctx.i18n.t(LanguageTexts.devil_union_10)}`,
                                            callback_data:
                                                devil_information.union_10.id,
                                        },
                                        {
                                            text: `${ctx.i18n.t(LanguageTexts.devil_union_25)}`,
                                            callback_data:
                                                devil_information.union_25.id,
                                        },
                                        {
                                            text: `${ctx.i18n.t(LanguageTexts.devil_union_50)}`,
                                            callback_data:
                                                devil_information.union_50.id,
                                        },
                                        {
                                            text: `${ctx.i18n.t(LanguageTexts.devil_union_65)}`,
                                            callback_data:
                                                devil_information.union_65.id,
                                        },
                                        {
                                            text: `${ctx.i18n.t(LanguageTexts.devil_union_80)}`,
                                            callback_data:
                                                devil_information.union_80.id,
                                        },
                                        {
                                            text: `${ctx.i18n.t(LanguageTexts.devil_union_100)}`,
                                            callback_data:
                                                devil_information.union_100.id,
                                        },
                                        {
                                            text: `${ctx.i18n.t(LanguageTexts.back)}`,
                                            callback_data:
                                                ENUM_DEVIL_BACK.BACK_3,
                                        },
                                    ],
                                ],
                            },
                        }
                    );
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
    @WizardStep(4)
    async step6(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const union_id = ctx.callbackQuery.data;
                    const info =
                        await this.devilService.findSpellsByUnion(union_id);
                    const spells = info.spells;
                    const caption = spells
                        .map(
                            (spell) =>
                                `${spell.name}${spell.castTime}${spell.cost}${spell.duration}${spell.range}${spell.description}\n\n`
                        )
                        .join();
                    await ctx.replyWithPhoto(
                        { source: LUCIFERO_IMAGE_PATH },
                        {
                            caption: caption,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: `${ctx.i18n.t(LanguageTexts.back)}`,
                                            callback_data:
                                                ENUM_DEVIL_BACK.BACK_4,
                                        },
                                    ],
                                ],
                            },
                        }
                    );
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
 */
