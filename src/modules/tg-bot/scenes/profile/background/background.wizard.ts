import { Inject, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Context, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import {
    BACK_BUTTON,
    EDIT_AVATAR_BUTTON,
    EDIT_HISTORY_BUTTON,
    EDIT_NAME_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Markup } from 'telegraf';
import { Logger } from 'winston';
@Scene(ENUM_SCENES_ID.BACKGROUND_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class BackgroundScene {
    constructor(
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Context() ctx: BotContext, @Sender('id') telegramId) {
        const background =
            await this.characterService.findBackgroundByTgId(telegramId);
        const name = `<strong>Имя</strong>: ${background.name}\n`;
        const sex = `<strong>Пол</strong>: ${background.sex}\n`;
        const age = `<strong>Возраст</strong>: ${background.age}\n`;
        const state = `<strong>Страна происхождения</strong>: ${background.state.name}\n`;
        const race = `<strong>Раса</strong>: ${background.race.name}\n`;
        const caption = `<strong>Профиль</strong>\n\n${name}${sex}${age}${state}${race}`;
        await ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [EDIT_NAME_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }

    @Hears(EDIT_NAME_BUTTON)
    async editName(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_NAME_SCENE_ID);
    }

    @Hears(EDIT_HISTORY_BUTTON)
    async editHistory(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_CHARACTER_HISTORY_SCENE_ID);
    }

    @Hears(EDIT_AVATAR_BUTTON)
    async editAvatar(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_AVATAR_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async profile(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
