import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { DevilsService } from 'src/modules/devils/services/devils.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'winston';
import {
    DEVIL_FLOOR_1_BUTTON,
    DEVIL_FLOOR_2_BUTTON,
    DEVIL_FLOOR_3_BUTTON,
    DEVIL_FLOOR_4_BUTTON,
    DEVIL_FLOOR_5_BUTTON,
    DEVIL_FLOOR_6_BUTTON,
    DEVIL_FLOOR_7_BUTTON,
    BACK_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_DEVIL_FLOOR } from 'src/modules/devils/constants/devil.floor.enum';

@Injectable()
export class DevilEditFloorWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly devilsService: DevilsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.DEVIL_EDIT_FLOOR_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Выберите этаж дьявола.', {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback(DEVIL_FLOOR_1_BUTTON, '1')],
                    [Markup.button.callback(DEVIL_FLOOR_2_BUTTON, '2')],
                    [Markup.button.callback(DEVIL_FLOOR_3_BUTTON, '3')],
                    [Markup.button.callback(DEVIL_FLOOR_4_BUTTON, '4')],
                    [Markup.button.callback(DEVIL_FLOOR_5_BUTTON, '5')],
                    [Markup.button.callback(DEVIL_FLOOR_6_BUTTON, '6')],
                    [Markup.button.callback(DEVIL_FLOOR_7_BUTTON, '7')],
                ]),
            });
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Описание не изменено.');
            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.action(/(1|2|3|4|5|6|7)/g, async (ctx) => {
            await ctx.answerCbQuery();
            const floor = ctx.callbackQuery['data'];
            const devilId = ctx.session.devilId;
            await this.devilsService.updateDevilFloor(devilId, floor);
            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        return composer;
    }
}
