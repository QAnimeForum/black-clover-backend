import {
    Ctx,
    Hears,
    Scene,
    SceneEnter,
    Sender,
} from 'nestjs-telegraf';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { LanguageTexts } from '../../constants/language.text.constant';

@Scene(SceneIds.profile)
@UseFilters(TelegrafExceptionFilter)
export class ProfileScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const senderId = sender.id;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const name = `${ctx.i18n.t(LanguageTexts.character_profile_name)}: ${background.name}\n`;
        const sex = `${ctx.i18n.t(LanguageTexts.character_profile_sex)}: ${background.sex}\n`;
        const age = `${ctx.i18n.t(LanguageTexts.character_profile_age)}: ${background.age}\n`;
        const state = `${ctx.i18n.t(LanguageTexts.character_profile_state)}: ${background.state.name}\n`;
        const race = `${ctx.i18n.t(LanguageTexts.character_profile_race)}: ${background.race.name}\n`;
        const caption = `${ctx.i18n.t(LanguageTexts.character_profile)}\n\n${name}${sex}${age}${state}${race}`;
        ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [
                        BUTTON_ACTIONS.grimoire,
                        BUTTON_ACTIONS.bio,
                        BUTTON_ACTIONS.params,
                    ],
                    [BUTTON_ACTIONS.wallet, BUTTON_ACTIONS.inventory],
                    [BUTTON_ACTIONS.myDevils, BUTTON_ACTIONS.mySpirits],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }
    @Hears(BUTTON_ACTIONS.grimoire)
    async grimoire(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoire);
    }
    @Hears(BUTTON_ACTIONS.bio)
    async bio(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.bio);
    }
    @Hears(BUTTON_ACTIONS.params)
    async params(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.characterParameters);
    }
    @Hears(BUTTON_ACTIONS.wallet)
    async wallet(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.wallet);
    }
    @Hears(BUTTON_ACTIONS.inventory)
    async inventory(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.inventory);
    }
    @Hears(BUTTON_ACTIONS.myDevils)
    async myDevils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.myDevils);
    }

    @Hears(BUTTON_ACTIONS.mySpirits)
    async mySpirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.mySpirits);
    }
}

/**
 *     @SceneEnter()
    async start(@Context() ctx: BotContext, @Sender() sender) {
        const character = (
            await this.characterService.getCharacterInfoByTgId(sender.id)
        ).character;
        const content = `${ctx.i18n.t(LanguageTexts.character_profile)}${ctx.i18n.t(LanguageTexts.character_profile_name)}${character.background.name}${ctx.i18n.t(LanguageTexts.character_profile_age)}${character.background.age}${ctx.i18n.t(LanguageTexts.character_profile_sex)}${character.background.sex}${ctx.i18n.t(LanguageTexts.character_profile_state)}${character.background.state.name}${ctx.i18n.t(LanguageTexts.character_profile_race)}${character.background.race.name}`;
        await ctx.replyWithPhoto(
            { source: KNIGHT_IMAGE_PATH },
            {
                caption: content,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Гримуар',
                                callback_data: SceneIds.grimoire,
                            },
                            {
                                text: 'Инвентарь',
                                callback_data: SceneIds.inventory,
                            },
                        ],
                        [
                            { text: 'Кошелёк', callback_data: SceneIds.wallet },
                            { text: 'Работа', callback_data: SceneIds.work },
                        ],
                        [
                            {
                                text: 'Ваша биография',
                                callback_data: SceneIds.bio,
                            },
                            {
                                text: 'Ваши характеристики',
                                callback_data: SceneIds.characterParameters,
                            },
                        ],
                        [
                            {
                                text: 'Ваши дьяволы',
                                callback_data: SceneIds.myDevils,
                            },
                            {
                                text: 'Ваши духи',
                                callback_data: SceneIds.mySpirits,
                            },
                        ],
                    ],
                },
            }
        );
    }
    // STEP - 1 start travel
    @WizardStep(1)
    async goToOtherStep(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    await ctx.scene.enter(ctx.callbackQuery.data);
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
 */
