import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { BackgroundService } from 'src/modules/character/services/background.service';
import { EDIT_NAME_BUTTON, EDIT_WEAKNESS_BUTTON } from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { LOGGER_INFO } from 'src/modules/tg-bot/utils/logger';
import { Composer, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'winston';

@Injectable()
export class WeaknessEditWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly backgroundService: BackgroundService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.EDIT_WEAKNESS_SCENE_ID,
            this.start(),
            this.step1()
        );

        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Слабости не изменены.');
            await ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        composer.action(EDIT_WEAKNESS_BUTTON, async (ctx) => {
            await ctx.reply('Введите свои слабости.');
            ctx.wizard.next();
        });
        return composer;
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Слабости не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const message = ctx.update?.message.text;
            await this.backgroundService.updateUserWeakness({
                weaknesses: message,
                telegramId: ctx.update?.message.from.id.toString(),
            });
            this.logger.log(
                LOGGER_INFO,
                `🟢 Пользователь успешно изменил слабости персонажа. * { name: ${ctx.update.message.from.first_name} id: ${ctx.update.message.from.id}}`
            );
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        return composer;
    }
}