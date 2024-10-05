import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { DevilsService } from 'src/modules/devils/services/devils.service';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'winston';

@Injectable()
export class DevilEditDescriptionWizard {
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
            ENUM_SCENES_ID.DEVIL_EDIT_DESCRIPTION_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Введите новое описание.', {
                parse_mode: 'HTML',
                ...Markup.removeKeyboard(),
            });
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Описание не изменено.');
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const message = ctx.update?.message.text;
            const devilId = ctx.session.devilId;

            const devil = await this.devilsService.updateDevilDescription(
                devilId,
                {
                    description: message,
                }
            );
            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        return composer;
    }
}
