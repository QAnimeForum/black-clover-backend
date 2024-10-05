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

@Scene(ENUM_SCENES_ID.CITY_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class CityScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        await ctx.reply('Карта загружается...');
        const burg = await this.mapService.findBurgById(
            ctx.session.map.currentCity.id
        );
        let caption = `<strong>${burg.name}</strong>\n`;
        if (burg.isCaptial) {
            caption += `⭐️\n`;
        }
        if (burg.hasPort) {
            caption += `⚓️\n`;
        }
        if (burg.hasWalls) {
            caption += `🏰\n`;
        }
        if (burg.hasShoppingArea) {
            caption += `🛍\n`;
        }
        if (burg.hasSlum) {
            caption += `🏚\n`;
        }
        caption += `<strong>Описание</strong>\n`;
        caption += burg.description;
        const buttons = [];
        buttons.push(BACK_TO_REGION_BUTTON);
        await ctx.deleteMessage();
        await ctx.replyWithPhoto(
            { source: WORLD_MAP_IMAGE_PATH },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }
    @Hears(BACK_TO_REGION_BUTTON)
    async back(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.REGION_SCENE_ID);
    }
}

/**
 * ⭐️ - поселение является столицей королевства.
⚓️ - в поселении есть порт(ы)
🏯 - в поселении есть цитадель (замок).
🏰 - обнесено ли поселение стеной
🛍 - является ли поселение торговым центром (есть большая рыночнная площадь)
🏚 - есть ли трущобы
 */
