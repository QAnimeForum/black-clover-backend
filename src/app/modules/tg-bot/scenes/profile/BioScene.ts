import {
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Context, Markup } from 'telegraf';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';
import { LanguageTexts } from '../../constants/language.text.constant';

@Scene(SceneIds.bio)
@UseFilters(TelegrafExceptionFilter)
export class BioScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService,
        private readonly userService: UserService
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
        await ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [BUTTON_ACTIONS.background.EDIT_NAME],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.background.EDIT_NAME)
    async editName(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.editCharacterName);
    }
    @Hears(BUTTON_ACTIONS.back)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
}

@Wizard(SceneIds.editCharacterName)
@UseFilters(TelegrafExceptionFilter)
export class EditCharactreName {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService
    ) {}

    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        ctx.reply('Введите новое имя');
    }

    @WizardStep(1)
    @On(['text'])
    //@UseInterceptors(TgBotLoggerInterceptor)
    async changeName(
        @Ctx() ctx: BotContext,
        @Sender() sender,
        @Message('text') msg: string
    ) {
        this.characterService.changeCharacterName({
            id: sender.id,
            name: msg,
        });
        ctx.scene.enter(SceneIds.bio);
    }
}
