import { Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
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
    ARMED_FORCES_BUTTON,
    BACK_BUTTON,
    MAGIC_PARLAMENT_BUTTON,
    MINES_BUTTON,
} from '../../constants/button-names.constant';

@Scene(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class OrganizationsScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const background = await this.characterService.findBackgroundByTgId(
            sender.id
        );
        const state = background.state;
        const title = `<strong><u>${state.fullName}</u></strong>\n\n`;
        const description = state.description;
        const title1 = `<strong><u>Государственные организации</u></strong>`;
        const title2 = `<strong><u>Частные организации</u></strong>`;
        const title3 = `<strong><u>Преступные организации</u></strong>`;
        const caption = `${title}${description}\n\n${title1}\n${title2}\n${title3}\n`;
        ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [MAGIC_PARLAMENT_BUTTON, ARMED_FORCES_BUTTON, MINES_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }

    @Hears(MAGIC_PARLAMENT_BUTTON)
    async magicParlament(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID);
    }

    @Hears(ARMED_FORCES_BUTTON)
    async armedForces(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID);
    }

    @Hears(MINES_BUTTON)
    async mines(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MINES_SCENE_ID);
    }
}