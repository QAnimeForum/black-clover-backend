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
    GARDEN_BUTTON,
    GRIMOIRE_TOWER_BUTTON,
    MAGIC_PARLAMENT_BUTTON,
    MINES_BUTTON,
    SHOPPING_DISTRICT_BUTTON,
} from '../../constants/button-names.constant';

@Scene(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class GrimoireTowerScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const caption = 'Это башня гримуаров';
        await ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([[BACK_BUTTON]]).resize(),
            }
        );
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}
