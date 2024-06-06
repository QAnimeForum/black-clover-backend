import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Markup } from 'telegraf';
import {
    ADD_SPELL_BUTTON,
    BACK_BUTTON,
    FIND_GRIMOIRE_BY_TG_BUTTON,
    GRIMOIRE_LIST_BUTTON,
} from '../../constants/button-names.constant';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Scene(ENUM_SCENES_ID.EDIT_GRIMOIRES_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminGrimoireScene {
    constructor(
        private readonly grimoireService: GrimoireService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        if (ctx.session.grimoireId == null) {
            const caption = 'Админская панель';
            await ctx.reply(caption, {
                ...Markup.keyboard([
                    [GRIMOIRE_LIST_BUTTON],
                    [FIND_GRIMOIRE_BY_TG_BUTTON],
                    [BACK_BUTTON],
                ])
                    .resize()
                    .oneTime(),
            });
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
            let caption = `<strong><u>ГРИМУАР</u></strong>\n\n<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Симбол на обложке:</strong>${grimoire.coverSymbol}\n<strong>Статус:</strong> ${grimoire.status}\n`;
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
                            ADD_SPELL_BUTTON,
                            ADD_SPELL_BUTTON
                        ),
                    ],
                    [Markup.button.callback(BACK_BUTTON, BACK_BUTTON)],
                ]),
            });
            ctx.session.grimoireId = null;
        }
    }
    @Hears(GRIMOIRE_LIST_BUTTON)
    @Action(BACK_BUTTON)
    async findByGrimoireList(@Ctx() ctx: BotContext) {
        if (ctx.callbackQuery) {
            ctx.answerCbQuery();
        }
        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
        });
        const totalItems = paginatedGrimoires.meta.totalItems;
        let caption = `Общее количество гримуаров: ${totalItems}\n\n`;
        const buttons = [];
        paginatedGrimoires.data.map((grimoire, index) => {
            const line = `<u>Гримуар № ${index + 1}</u>\n<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Симбол на обложке:</strong>${grimoire.coverSymbol}\n<strong>Статус:</strong>`;
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
            console.log(selectedGrimoireId);
            ctx.session.grimoireId = selectedGrimoireId;
            const grimoire =
                await this.grimoireService.findGrimoireById(selectedGrimoireId);
            const spells = grimoire.spells;
            let caption = `<strong><u>ГРИМУАР</u></strong>\n\n<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Симбол на обложке:</strong>${grimoire.coverSymbol}\n<strong>Статус:</strong> ${grimoire.status}\n`;
            caption += '<strong><u>ЗАКЛИНАНИЯ</u></strong>\n';
            const buttons = [];
            spells.map((spell, index) => {
                caption += `${index + 1}) ${spell.name} Статус:${spell.status}\n`;
                buttons.push([
                    Markup.button.callback(spell.name, `SPELL:${spell.id}`),
                ]);
            });
            buttons.push(
                [Markup.button.callback(ADD_SPELL_BUTTON, ADD_SPELL_BUTTON)],
                [Markup.button.callback(BACK_BUTTON, BACK_BUTTON)]
            );
            if (spells.length == 0) caption += 'Заклинаний нет';
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            });
        }
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
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
