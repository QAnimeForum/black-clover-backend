import { Inject, Injectable } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Composer, Scenes, Telegraf } from 'telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { TgBotService } from '../../services/tg-bot.service';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { SceneIds } from '../../constants/scenes.id';
import { message } from 'telegraf/filters';

@Injectable()
export class CreateSquadWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly characterService: CharacterService,
        private readonly squadService: SquadsService,
        private readonly tgBotService: TgBotService
    ) {
        // Create scene and add steps
        this.steps = [this.start(), this.step1(), this.exit()];
        this.scene = new Scenes.WizardScene<BotContext>(
            SceneIds.createSquad,
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
                console.log(ctx.scene.session.squad);
                ctx.scene.session.squad = {
                    name: '',
                    description: '',
                    forces_id: ctx.session.armed_forces_id,
                };
                await ctx.reply('Введите название отряда');
                ctx.wizard.next();
            });
        });
    }

    step1() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.squad.name = msg;
                await ctx.reply('Введите описание отряда');
                ctx.wizard.next();
            });
        });
    }
    exit() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.squad.description = msg;
                console.log(ctx.scene.session.squad);
                const squad = await this.squadService.createSquad(
                    ctx.scene.session.squad
                );
                console.log(squad);
                ctx.scene.enter(SceneIds.armedForces);
            });
        });
    }
}
