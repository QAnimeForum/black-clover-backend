import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { DevilsService } from 'src/modules/devils/services/devils.service';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'winston';

@Injectable()
export class SpellDurationEditWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly grimoireService: GrimoireService,
        private readonly devilService: DevilsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.EDIT_SPELL_DURATION_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Введите продолжительность действия заклинания.');
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
            if (ctx.session.editUnionSpellId) {
                const unionId = ctx.session.editUnionSpellId;
                const union = await this.devilService.findDefaultSpell(unionId);
                await this.grimoireService.updateSpellDuration(union.spell.id, {
                    duration: message,
                });
                await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
            } else {
                const spellId = ctx.session.spellEdit.spellId;
                await this.grimoireService.updateSpellDuration(spellId, {
                    duration: message,
                });
                await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
            }
        });
        return composer;
    }
}
