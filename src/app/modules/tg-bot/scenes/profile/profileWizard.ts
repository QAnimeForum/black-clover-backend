import {
    Context,
    Message,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { LanguageTexts } from '../../constants/language.text.constant';

@Wizard(SceneIds.profile)
@UseFilters(TelegrafExceptionFilter)
export class ProfileWizard {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext, @Sender() sender) {
        const character = await this.characterService.getCharacterInfo(
            sender.id
        );
        console.log(character.background);
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
        //await ctx.scene.leave();
    }
}
