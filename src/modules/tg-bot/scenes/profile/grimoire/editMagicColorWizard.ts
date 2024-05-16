import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';

import { Inject, Injectable } from '@nestjs/common';
import { Telegraf, Scenes, Composer } from 'telegraf';
import { message } from 'telegraf/filters';
import { SceneIds } from '../../../constants/scenes.id';
import { BotContext } from '../../../interfaces/bot.context';
import { TgBotService } from '../../../services/tg-bot.service';
import { GrimoireService } from '../../../../grimoire/services/grimoire.service';

//@Wizard(SceneIds.createCharacter)
//@UseFilters(TelegrafExceptionFilter)
@Injectable()
export class EditGrimoireMagicColorWizard {
    //   private readonly logger = new Logger(AddDiscountWizard.name)
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly grimoireService: GrimoireService,
        private readonly tgBotService: TgBotService
    ) {
        // Create scene and add steps
        this.steps = [this.start(), this.step1()];
        this.scene = new Scenes.WizardScene<BotContext>(
            SceneIds.grimoireEditMagicColor,
            ...this.steps
        );
        // Register add discount wizard
        this.stage.register(this.scene);
        bot.use(stage.middleware());
        bot.catch((err: Error, ctx) => {
            console.log(err);
            // this.tgBotService.catchException(err, ctx, this.logger)
        });
    }

    start() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.reply('Редактировать  цвет магии');
                ctx.wizard.next();
            });
        });
    }

    step1() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                const user = ctx.update?.message.from.id;
                const grimoire =
                    await this.grimoireService.findGrimoireByUserTgId(
                        user.toString()
                    );
               /* await this.grimoireService.updateGrimoreMagicColor(
                    grimoire.id,
                    {
                        magicColor: msg,
                    }
                );*/
                await ctx.scene.enter(SceneIds.grimoire);
            });
        });
    }
}
