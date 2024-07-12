import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'winston';

@Injectable()
export class CreateRequestWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly grimoireService: GrimoireService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.COME_UP_WITH_MAGICAL_ATTRIBUTE_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Введите магию/список магий, который вы хотите.');
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply(
                'Продолжительность действия заклинания не изменена.'
            );
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const message = ctx.update?.message.text;
            try {
                await this.grimoireService.createGrimoireRequest(
                    ctx.message.from.id.toString(),
                    ctx.message.from.username,
                    message
                );
                await ctx.reply(
                    'Небеса услышали вас и скоро с вами свяжутся. '
                );
            } catch (err) {
                await ctx.reply('Заявка уже принята, к вам придут.');
            }
            await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
        });
        return composer;
    }
}
