import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Markup } from 'telegraf';
import {
    ADD_SPELL_BUTTON,
    BACK_BUTTON,
    EDIT_MAGIC_NAME_BUTTON,
    EDIT_SPELL_COOLDOWN_BUTTON,
    EDIT_SPELL_COST_BUTTON,
    EDIT_SPELL_DESCRIPTION_BUTTON,
    EDIT_SPELL_DURATION_BUTTON,
    EDIT_SPELL_GOALS_BUTTON,
    EDIT_SPELL_MINIMAL_LEVEL_BUTTON,
    EDIT_SPELL_NAME_BUTTON,
    EDIT_SPELL_TYPE_BUTTON,
    FIND_GRIMOIRE_BY_TG_BUTTON,
    GRIMOIRE_LIST_BUTTON,
} from '../../constants/button-names.constant';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_GRIMOIRE_STATUS } from 'src/modules/grimoire/constants/grimoire.enum.constant';
import { ENUM_SPELL_STATUS } from 'src/modules/grimoire/constants/spell.status.enum.constant';

@Scene(ENUM_SCENES_ID.EDIT_GRIMOIRES_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminGrimoireScene {
    constructor(
        private readonly grimoireService: GrimoireService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        console.log(ctx.session.spellId);
        if (ctx.session.spellId) {
            this.spell(ctx, ctx.session.spellId);
            //  ctx.session.grimoireId == null;
            //   ctx.session.spellId == null;
        } else {
            const caption = 'Админская панель';
            await ctx.reply(caption, {
                ...Markup.keyboard([
                    [GRIMOIRE_LIST_BUTTON],
                    [FIND_GRIMOIRE_BY_TG_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            });
        }
        /**
         * if (ctx.session.grimoireId == null) {
        } else {
            await ctx.reply('Админская панель', {
                ...Markup.keyboard([
                    [GRIMOIRE_LIST_BUTTON],
                    [FIND_GRIMOIRE_BY_TG_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            });
            const grimoire = await this.grimoireService.findGrimoireById(
                ctx.session.grimoireId
            );
            const spells = grimoire.spells;
            let caption = `<strong><u>ГРИМУАР</u></strong>\n\n<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Символ на обложке:</strong>${grimoire.coverSymbol}\n<strong>Статус:</strong> ${grimoire.status}\n`;
            caption += '<strong><u>ЗАКЛИНАНИЯ</u></strong>\n';
            spells.map((spell, index) => {
                caption += `${index}) ${spell.name}${spell.status}\n`;
            });
            if (spells.length == 0) caption += 'Заклинаний нет';
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            EDIT_MAGIC_NAME_BUTTON,
                            EDIT_MAGIC_NAME_BUTTON
                        ),
                        Markup.button.callback(
                            ADD_SPELL_BUTTON,
                            ADD_SPELL_BUTTON
                        ),
                    ],
                    [Markup.button.callback(BACK_BUTTON, BACK_BUTTON)],
                ]),
            });
            ctx.session.grimoireId = null;
        }
         */
    }
    @Hears(GRIMOIRE_LIST_BUTTON)
    @Action(BACK_BUTTON)
    async findByGrimoireList(@Ctx() ctx: BotContext) {
        if (ctx.callbackQuery) {
            ctx.answerCbQuery();
        }
        ctx.session.grimoireId == null;
        ctx.session.spellId == null;
        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
        });
        const totalItems = paginatedGrimoires.meta.totalItems;
        let caption = `Общее количество гримуаров: ${totalItems}\n\n`;
        const buttons = [];
        paginatedGrimoires.data.map((grimoire, index) => {
            let grimoireStatus = '';
            switch (grimoire.status) {
                case ENUM_GRIMOIRE_STATUS.APPROVED: {
                    grimoireStatus = 'Грмуар одобрен';
                    break;
                }
                case ENUM_GRIMOIRE_STATUS.NOT_APPROVED: {
                    grimoireStatus = 'Гримуар не одобрен';
                    break;
                }
            }
            const line = `<u>Гримуар № ${index + 1}</u>\n<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Символ на обложке:</strong>${grimoire.coverSymbol}\n<strong>Статус:</strong>${grimoireStatus}`;
            caption += line;
            buttons.push([
                Markup.button.callback(
                    `Гримуар №  ${index + 1}`,
                    `GRIMOIRE:${grimoire.id}`
                ),
            ]);
        });
        buttons.push(
            [
                Markup.button.callback('Все гримуары', `ALL_APPROVED_GRIMORE`),
                Markup.button.callback('В работе у меня', `MY_GRIMOIRE`),
            ],
            [
                Markup.button.callback(
                    'Все неободренные',
                    `NOT_APPROVED_GRIMORE`
                ),
                Markup.button.callback('Все одобренные', `APPROVED_GRIMORE`),
            ]
        );
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(GRIMOIRE.*)$/)
    async showGrimoire(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const selectedGrimoireId = ctx.callbackQuery.data.split(':')[1];
            ctx.session.grimoireId = selectedGrimoireId;
            this.grimoire(ctx, selectedGrimoireId);
        }
    }
    async grimoire(ctx: BotContext, selectedGrimoireId: string) {
        const grimoire =
            await this.grimoireService.findGrimoireById(selectedGrimoireId);
        const spells = grimoire.spells;
        let grimoireStatus = '';
        switch (grimoire.status) {
            case ENUM_GRIMOIRE_STATUS.APPROVED: {
                grimoireStatus = 'Грмуар одобрен';
                break;
            }
            case ENUM_GRIMOIRE_STATUS.NOT_APPROVED: {
                grimoireStatus = 'Гримуар не одобрен';
                break;
            }
        }
        let caption = `<strong><u>ГРИМУАР</u></strong>\n\n<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Символ на обложке:</strong>${grimoire.coverSymbol}\n<strong>Статус:</strong> ${grimoireStatus}\n`;
        caption += '<strong><u>ЗАКЛИНАНИЯ</u></strong>\n';
        const buttons = [];
        spells.map((spell, index) => {
            let status = '';
            switch (spell.status) {
                case ENUM_SPELL_STATUS.DRAFT: {
                    status = 'Черновик';
                    break;
                }
                case ENUM_SPELL_STATUS.NOT_APPROVED: {
                    status = 'Не одобрено';
                    break;
                }
                case ENUM_SPELL_STATUS.APPROVED: {
                    status = 'Одобрено';
                    break;
                }
            }
            caption += `${index + 1}) ${spell.name}, cтатус: ${status}\n`;
            buttons.push([
                Markup.button.callback(spell.name, `SPELL:${spell.id}`),
            ]);
        });
        buttons.push(
            [
                Markup.button.callback(
                    EDIT_MAGIC_NAME_BUTTON,
                    EDIT_MAGIC_NAME_BUTTON
                ),
            ],
            [Markup.button.callback(ADD_SPELL_BUTTON, ADD_SPELL_BUTTON)],
            [Markup.button.callback(BACK_BUTTON, BACK_BUTTON)]
        );
        if (spells.length == 0) caption += 'Заклинаний нет';
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^(SPELL.*)$/)
    async showSpell(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const selectedSpellId = ctx.callbackQuery.data.split(':')[1];
            ctx.session.spellId = selectedSpellId;
            this.spell(ctx, selectedSpellId);
        }
    }

    async spell(ctx: BotContext, selectedSpellId: string) {
        const spell = await this.grimoireService.findSpellById(selectedSpellId);
        const title = '<strong><u>Заклинание</u></strong>';
        const name = `<strong>Название: </strong> ${spell.name}`;
        const type = `<strong>Тип: </strong> ${spell.type}`;
        const damage = `<strong>Урон: </strong> ${spell.damage}`;
        const range = `<strong>Область действия заклинания: </strong> ${spell.range}`;
        const duration = `<strong>Продолжительность: </strong> ${spell.duration}`;
        const cost = `<strong>Стоимость: </strong> ${spell.cost}`;
        const castTime = `<strong>Сколько времени нужно для создания заклинания: </strong> ${spell.castTime}`;
        const cooldown = `<strong>Время отката заклинания: </strong> ${spell.cooldown}`;
        const goals = `<strong>Цели: </strong> ${spell.goals}`;
        const minLevel = `<strong>Минимальный уровень персонажа: </strong> ${spell.requirements.minimalLevel}`;
        const requipments = '<strong>Требования: </strong>';
        const description = `<strong>Описание</strong>\n ${spell.description}`;
        const caption = `${title}\n${name}\n${type}\n${damage}\n${range}\n${duration}\n${cost}\n${castTime}\n${cooldown}\n${goals}\n${minLevel}\n${requipments}\n${description}`;

        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
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
                        EDIT_SPELL_MINIMAL_LEVEL_BUTTON,
                        EDIT_SPELL_MINIMAL_LEVEL_BUTTON
                    ),
                ],
                [Markup.button.callback(BACK_BUTTON, 'BACK_TO_GRIMOIRE')],
            ]),
        });
    }
    @Action('BACK_TO_GRIMOIRE')
    async backToGrimoire(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.session.spellId == null;
        this.grimoire(ctx, ctx.session.grimoireId);
    }
    @Action(ADD_SPELL_BUTTON)
    async addSpell(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.CREATE_SPELL_FORM_SCENE_ID);
    }
    @Hears(FIND_GRIMOIRE_BY_TG_BUTTON)
    async findByTgId(@Ctx() ctx: BotContext) {
        await ctx.reply('В разработке');
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

    @Action(EDIT_SPELL_MINIMAL_LEVEL_BUTTON)
    async editSpellMinLevel(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_MINIMAL_LEVEL_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
