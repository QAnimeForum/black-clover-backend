import { Inject, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
    Context,
    Hears,
    Message,
    On,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
@Wizard(ENUM_SCENES_ID.EDIT_AVATAR_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AvatarEditWizard {
    constructor(
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        ctx.reply('Пришлите новую аватарку.');
    }

    @WizardStep(1)
    async changeName(
        @Context() ctx: BotContext,
        @Sender('id') id,
        @Message('text') msg: string
    ) {
        this.characterService.changeCharacterName({
            id: id,
            name: msg,
        });
        ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
    }

    @Hears(/^\/?(cancel)$/i)
    async onCancel(@Context() ctx: BotContext) {
        await ctx.reply('Имя не изменено.');
        await ctx.scene.leave();
    }
}
