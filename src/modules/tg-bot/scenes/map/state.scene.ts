import {
    Context,
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Start,
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
import { BACK_BUTTON } from '../../constants/button-names.constant';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { BackgroundService } from 'src/modules/character/services/background.service';
import fs from 'fs';

@Scene(ENUM_SCENES_ID.STATE_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class StateScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly mapService: MapService,
        private readonly squadService: SquadsService,
        private readonly backgroundService: BackgroundService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async enter(@Context() ctx: BotContext) {
        await ctx.reply('Карта загружается...');
        const buttons = [];
        const state = await this.mapService.findStateById(
            ctx.session.map.currentState.id
        );
        const regions = await this.mapService.findAllPrivinces({
            path: '',
            filter: {
                'state.id': `$eq:${ctx.session.map.currentState.id}`,
            },
        });
        const armedForces =
            await this.squadService.findArmedForcesByState(state);
        for (let i = 0; i < regions.data.length - 1; i += 2) {
            buttons.push([
                `🃏 ${regions.data[i].shortName}`,
                `🃏 ${regions.data[i + 1].shortName}`,
            ]);
        }
        if (regions.data.length % 2 !== 0) {
            buttons.push([
                `🃏 ${regions.data[regions.data.length - 1].shortName}`,
            ]);
        }
        buttons.push([BACK_BUTTON]);

        const playersCount = await this.backgroundService.countUsersFromState(
            ctx.session.map.currentState.id
        );
        let caption = `<strong>${state.fullName}</strong>\n\n`;
        caption += `<strong>⚜️Символ:</strong> ${state.symbol}\n`;
        caption += `<strong>🏤Форма правления:</strong> ${state.form.name}\n`;
        caption += `<strong>🛡Название армии: ${armedForces.name}</strong>\n`;
        caption += `<strong>📖Описание</strong>\n ${state.description}\n\n`;
        caption += `<strong>📊Статистика</strong>\n`;
        caption += `<em>Количество областей:</em> ${regions.data.length}\n`;
        //    caption += `<em>Количество городов:</em>\n`;
        caption += `<strong>📊Статистика по игрокам</strong>\n\n`;
        //  caption += `<em>Количество жителей в королевстве: </em>\n`;
        caption += `<em>Количество игроков из этой страны:</em> ${playersCount}\n`;
        //  caption += `<em>Количество игроков, проживающих в этой стране:</em>\n`;
        await ctx.deleteMessage();

        const imagePath = `${process.env.APP_API_URL}/Assets/images/${state.image}`;
        console.log(
            imagePath,
            fs.existsSync(imagePath),
            fs.lstatSync(imagePath).isFile()
        );
        await ctx.replyWithPhoto(
            {
                source:
                    fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()
                        ? imagePath
                        : WORLD_MAP_IMAGE_PATH,
            },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }
    @Hears(BACK_BUTTON)
    async back(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MAP_SCENE_ID);
    }

    @Hears(/^🃏 (.*)$/)
    async goToProvince(@Ctx() ctx: BotContext, @Message() message) {
        const regionName = message.text.replace('🃏', '').trimLeft();
        const provinces = await this.mapService.findAllPrivinces({
            path: '',
            filter: {
                'state.id': `$eq:${ctx.session.map.currentState.id}`,
            },
        });
        const item = provinces.data.find(
            (province) => province.shortName == regionName
        );
        ctx.session.map.currentRegion = item;

        await ctx.scene.enter(ENUM_SCENES_ID.REGION_SCENE_ID);
    }
}
