import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, UseFilters } from '@nestjs/common';
import { CharacterService } from '../../../character/services/character.service';
import { Markup } from 'telegraf';
import { MapService } from '../../../map/service/map.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Logger } from 'winston';
import {
    BACK_BUTTON,
    FIND_GRIMOIRE_BY_TG_BUTTON,
    GRIMOIRE_LIST_BUTTON,
} from '../../constants/button-names.constant';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import {
    convertGrimoiresToTextAndInlineButtons,
    grimoireInlineKeyboard,
    grimoireToText,
} from '../../utils/grimoire.utils';
import { GrimoireEntity } from 'src/modules/grimoire/entity/grimoire.entity';

@Scene(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class GrimoireTowerScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly grimoireService: GrimoireService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        let caption = 'Это башня гримуаров\n';
        const chatType = ctx.chat.type;
        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
        });
        if (chatType == 'private') {
            const caption = 'Башня гримуаров';
            await ctx.reply(caption, {
                ...Markup.keyboard([
                    [GRIMOIRE_LIST_BUTTON],
                    [FIND_GRIMOIRE_BY_TG_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            });
        } else {
            const { text, buttons } =
                convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
            caption += text;
            await ctx.deleteMessage();
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            });
        }
    }

    @Hears(GRIMOIRE_LIST_BUTTON)
    async findByGrimoireList(@Ctx() ctx: BotContext) {
        if (ctx.callbackQuery) {
            ctx.answerCbQuery();
        }
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
    @Action(/^(GRIMOIRE.*)$/)
    async showGrimoire(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const selectedGrimoireId = ctx.callbackQuery.data.split(':')[1];
            ctx.session.grimoireId = selectedGrimoireId;
            const grimoire =
                await this.grimoireService.findGrimoireById(selectedGrimoireId);
            const caption = grimoireToText(grimoire);
            await ctx.editMessageText(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    Markup.button.callback(BACK_BUTTON, BACK_BUTTON),
                ]),
            });
        }
    }
    @Action(BACK_BUTTON)
    async grimoireList(@Ctx() ctx: BotContext) {
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
        await ctx.editMessageText(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}
