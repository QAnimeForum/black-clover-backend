import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Markup } from 'telegraf';
import {
    ADD_SPELL_BUTTON,
    BACK_BUTTON,
    CHANGE_GRIMOIRE_STATUS,
    EDIT_MAGIC_NAME_BUTTON,
    EDIT_SPELL_CHANGE_STATUS_BUTTON,
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
import {
    convertGrimoiresToTextAndInlineButtons,
    grimoireInlineKeyboard,
    grimoireToText,
    spellEditInlineKeyboard,
    spellToText,
} from '../../utils/grimoire.utils';

@Scene(ENUM_SCENES_ID.EDIT_GRIMOIRES_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminGrimoireScene {
    constructor(
        private readonly grimoireService: GrimoireService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        if (ctx.session.grimoireId) {
            const grimoire = await this.grimoireService.findGrimoireById(
                ctx.session.grimoireId
            );
            const caption = grimoireToText(grimoire);
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(grimoireInlineKeyboard()),
            });
        } else if (ctx.session.spellId) {
            const spell = await this.grimoireService.findSpellById(
                ctx.session.spellId
            );
            const caption = spellToText(spell);
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(spellEditInlineKeyboard()),
            });
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
        const { text, buttons } =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        await ctx.reply(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(CHANGE_GRIMOIRE_STATUS)
    async changeGrimoreStatus(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.CHANGE_GRIMOIRE_STATUS_SCENE_ID);
    }
    @Action(/^(GRIMOIRE.*)$/)
    async showGrimoire(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const selectedGrimoireId = ctx.callbackQuery.data.split(':')[1];
            ctx.session.grimoireId = selectedGrimoireId;
            const grimoire =
                await this.grimoireService.findGrimoireById(selectedGrimoireId);
            const caption = grimoireToText(grimoire);
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(grimoireInlineKeyboard()),
            });
        }
    }
    @Action(/^(SPELL.*)$/)
    async showSpell(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const selectedSpellId = ctx.callbackQuery.data.split(':')[1];
            ctx.session.spellId = selectedSpellId;
            const spell = await this.grimoireService.findSpellById(
                ctx.session.spellId
            );
            const caption = spellToText(spell);
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(spellEditInlineKeyboard()),
            });
        }
    }

    @Action(EDIT_MAGIC_NAME_BUTTON)
    async editMagicName(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_MAGIC_NAME_SCENE_ID);
    }
    @Action('BACK_TO_GRIMOIRE')
    async backToGrimoire(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        ctx.session.spellId == null;
        const grimoire = await this.grimoireService.findGrimoireById(
            ctx.session.grimoireId
        );
        const caption = grimoireToText(grimoire);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(grimoireInlineKeyboard()),
        });
    }
    @Action(EDIT_SPELL_CHANGE_STATUS_BUTTON)
    async changeSpellStatus(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SPELL_CHANGE_STATUS_SCENE_ID);
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
