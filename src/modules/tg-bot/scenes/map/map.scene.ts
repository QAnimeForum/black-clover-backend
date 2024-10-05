import {
    Context,
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Start,
    Wizard,
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

@Scene(ENUM_SCENES_ID.MAP_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MapScene {
    private static statesNames: Array<string>;
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        MapScene.statesNames = [];
    }

    @SceneEnter()
    async enter(@Context() ctx: BotContext) {
        ctx.session.map = {
            currentState: null,
            currentRegion: null,
            currentCity: null,
        };
        const buttons = [];
        await ctx.reply('Карта загружается....');
        const states = await this.mapService.findAllStates({
            path: '',
        });
        for (let i = 0; i < states.data.length - 1; i += 2) {
            buttons.push([
                `🎴 ${states.data[i].fullName} (${states.data[i].symbol})`,
                `🎴 ${states.data[i + 1].fullName} (${states.data[i + 1].symbol})`,
            ]);
        }
        buttons.push([BACK_BUTTON]);


        await ctx.replyWithPhoto(
            { source: WORLD_MAP_IMAGE_PATH },
            {
                caption: 'выберите, куда вы хотите отправиться',
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }
    @Hears(BACK_BUTTON)
    async back(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }

    @Hears(/^🎴 (.*)$/)
    async goToState(@Ctx() ctx: BotContext, @Message() message) {
        const states = await this.mapService.findAllStates({
            path: '',
        });
        const beforeBrace = message.text.split('(')[1] || '';
        const result = beforeBrace.split(')')[0] || null;
        const item = states.data.find((state) => state.symbol == result);
        ctx.session.map.currentState = item;

        await ctx.scene.enter(ENUM_SCENES_ID.STATE_SCENE_ID);
    }

    /*  @Start()
    async start(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }*/
}
