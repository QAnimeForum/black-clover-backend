import { Inject, Injectable } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Composer, Scenes, Telegraf } from 'telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { TgBotService } from '../../services/tg-bot.service';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { message } from 'telegraf/filters';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';

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
        this.steps = [this.step1(), this.exit()];
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.CREATE_SQUAD_SCENE_ID,
            ...this.steps
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
        bot.catch((err: Error, ctx) => {
            console.log(err);
        });
    }

    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.squad = {
                name: '',
                description: '',
                forces_id: ctx.session.adminSelectedArmedForcesId,
            };
            await ctx.reply('Введите название отряда');
        };
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
                ctx.scene.enter(
                    ENUM_SCENES_ID.ADMIN_ARMED_FORCES_MAGIC_SCENE_ID
                );
            });
        });
    }
}
