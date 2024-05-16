import { Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from '../../../character/services/character.service';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { MapService } from '../../../map/service/map.service';

@Scene(SceneIds.organizations)
@UseFilters(TelegrafExceptionFilter)
export class OrganizationsScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly mapService: MapService
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
                    [
                        BUTTON_ACTIONS.MAGIC_PARLAMENT,
                        BUTTON_ACTIONS.ARMED_FORCES,
                        BUTTON_ACTIONS.MINES,
                    ],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }

    @Hears(BUTTON_ACTIONS.MAGIC_PARLAMENT)
    async magicParlament(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.magicParlament);
    }

    @Hears(BUTTON_ACTIONS.ARMED_FORCES)
    async armedForces(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.armedForces);
    }

    @Hears(BUTTON_ACTIONS.MINES)
    async mines(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.mines);
    }
}
