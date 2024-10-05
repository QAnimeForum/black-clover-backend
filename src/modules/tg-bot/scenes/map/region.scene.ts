import {
    Context,
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { WORLD_MAP_IMAGE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { Inject, UseFilters } from '@nestjs/common';
import { MapService } from '../../../map/service/map.service';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Markup } from 'telegraf';
import {
    BACK_BUTTON,
    BACK_TO_REGION_BUTTON,
} from '../../constants/button-names.constant';
import { map } from 'lodash';

@Scene(ENUM_SCENES_ID.REGION_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class RegionScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        await ctx.reply('Карта загружается...');
        const buttons = [];
        console.log(ctx.session.map);
        const cities = await this.mapService.findAllBurgs({
            path: '',
            filter: {
                'province.id': `${ctx.session.map.currentRegion.id}`,
            },
        });
        for (let i = 0; i < cities.data.length - 1; i += 2) {
            buttons.push([
                `🏙 ${cities.data[i].name}`,
                `🏙 ${cities.data[i + 1].name}`,
            ]);
        }
        if (cities.data.length % 2 !== 0) {
            buttons.push([`🏙 ${cities.data[cities.data.length - 1].name}`]);
        }
        buttons.push([BACK_BUTTON]);
        const province = await this.mapService.findRegionById(
            ctx.session.map.currentRegion.id
        );
        let caption = `<strong><u>${province.shortName}</u></strong>\n`;
        caption += '<strong>Описание</strong>';
        await ctx.replyWithPhoto(
            { source: WORLD_MAP_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }
    @Hears(BACK_BUTTON)
    async back(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.STATE_SCENE_ID);
    }

    @Hears(/^🏙 (.*)$/)
    async goToState(@Ctx() ctx: BotContext, @Message() message) {
        const cityName = message.text.replace('🏙', '').trimLeft();

        const burgs = await this.mapService.findAllBurgs({
            path: '',
            filter: {
                'province.id': `${ctx.session.map.currentRegion.id}`,
            },
        });
        const item = burgs.data.find((burg) => burg.name == cityName);
        ctx.session.map.currentCity = item;
        await ctx.scene.enter(ENUM_SCENES_ID.CITY_SCENE_ID);
    }
}