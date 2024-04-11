import {
    Action,
    Context,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { GRIMOURE_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { LanguageTexts } from '../../constants/language.text.constant';
import { GrimoireService } from 'src/app/modules/grimoire/services/grimoire.service';

enum ENUM_GRIMOIRE_ACTIONS {
    BACK = 'BACK',
    CREATE_SPELL = 'CREATE_SPELL',
    EDIT_MAGIC = 'EDIT_MAGIC',
    EDIT_COLOR = 'EDIT_COLOR',
    SHOW_SPELLS = 'SHOW_SPELLS',
}
@Wizard(SceneIds.grimoire)
@UseFilters(TelegrafExceptionFilter)
export class GrimoireWizard {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly grimoireService: GrimoireService
    ) {}

    // STEP - 1
    @SceneEnter()
    async start(@Context() ctx: BotContext, @Sender() sender) {
        const grimoire = await this.grimoireService.findGrimoireByUserId(
            sender.id
        );
        const spellList = await this.grimoireService.findSpellNames(
            grimoire.id
        );

        let caption = `Ваш Гримуар\n\nМагия: ${grimoire.magicName}\nОбложка: ${grimoire.coverSymbol}\nЦвет магии: ${grimoire.magicColor}\n`;
        if (spellList.length === 0) {
            caption += `У вас нет заклинаний`;
        } else {
            caption += `Количество заклинаний: ${spellList.length}\n`;
            spellList.map(
                (item, index) => (caption += `${index + 1})${item.name}\n`)
            );
        }
        await ctx.sendPhoto(
            {
                source: GRIMOURE_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            ctx.i18n.t(LanguageTexts.grimoire_edit_magic),
                            ENUM_GRIMOIRE_ACTIONS.EDIT_MAGIC
                        ),
                    ],
                    [
                        Markup.button.callback(
                            ctx.i18n.t(LanguageTexts.grimoire_edit_color),
                            ENUM_GRIMOIRE_ACTIONS.EDIT_COLOR
                        ),
                    ],
                    [
                        Markup.button.callback(
                            ctx.i18n.t(LanguageTexts.grimoire_spell_create),
                            ENUM_GRIMOIRE_ACTIONS.CREATE_SPELL
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Показать описание заклинаний',
                            ENUM_GRIMOIRE_ACTIONS.SHOW_SPELLS
                        ),
                    ],
                    [
                        Markup.button.callback(
                            ctx.i18n.t(LanguageTexts.back),
                            ENUM_GRIMOIRE_ACTIONS.BACK
                        ),
                    ],
                ]),
            }
        );
        ctx.wizard.next();
    }

    @WizardStep(2)
    @Action(ENUM_GRIMOIRE_ACTIONS.BACK)
    async back(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
    @WizardStep(2)
    @Action(ENUM_GRIMOIRE_ACTIONS.CREATE_SPELL)
    async createSpell(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.createSpell);
    }

    @WizardStep(2)
    @Action(ENUM_GRIMOIRE_ACTIONS.EDIT_COLOR)
    async editColor(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoireEditColor);
    }
    @WizardStep(2)
    @Action(ENUM_GRIMOIRE_ACTIONS.EDIT_MAGIC)
    async editMagic(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoireEditName);
    }

    @WizardStep(2)
    @Action(ENUM_GRIMOIRE_ACTIONS.SHOW_SPELLS)
    async showSpells(@Context() ctx: BotContext, @Sender() sender) {
        const grimoire = await this.grimoireService.findGrimoireByUserId(
            sender.id
        );
        const [spellList] = await this.grimoireService.getAllSpells(
            grimoire.id
        );
        spellList.map(async (item) => {
            const content = `${ctx.i18n.t(LanguageTexts.spell_name)}${item.name}${ctx.i18n.t(LanguageTexts.spell_cast_time)}${item.castTime}${ctx.i18n.t(LanguageTexts.spell_cost)}${item.cost}${ctx.i18n.t(LanguageTexts.spell_cost)}${item.duration}${ctx.i18n.t(LanguageTexts.spell_range)}${item.range}${ctx.i18n.t(LanguageTexts.spell_description)}${item.description}`;
            await ctx.reply(content);
        });
    }
}

/**
 *  reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Начать путешествивие',
                                callback_data: SceneIds.createCharacter,
                            },
                        ],
                    ],
                },
 */
