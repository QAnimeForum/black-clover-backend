import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { Logger } from 'winston';
import { ENUM_SPELL_STATUS } from 'src/modules/grimoire/constants/spell.status.enum.constant';
import { BACK_BUTTON } from 'src/modules/tg-bot/constants/button-names.constant';

@Injectable()
export class SpellChangeStatusWizard {
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
            ENUM_SCENES_ID.EDIT_SPELL_CHANGE_STATUS_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Измените статус заклинания', {
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Черновик',
                            'STATUS:' + ENUM_SPELL_STATUS.DRAFT
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'На одобрении',
                            'STATUS:' + ENUM_SPELL_STATUS.NOT_APPROVED
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Одобрено',
                            'STATUS:' + ENUM_SPELL_STATUS.APPROVED
                        ),
                    ],
                    [Markup.button.callback(BACK_BUTTON, BACK_BUTTON)],
                ]),
            });
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
        });
        composer.action(BACK_BUTTON, async (ctx) => {
            await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
        });
        composer.action(/^(STATUS.*)$/, async (ctx) => {
            try {
                const spellId = ctx.session.spellEdit.spellId;
                const status = ctx.callbackQuery['data'].split(':')[1];
                const result = await this.grimoireService.updateSpellStatus(
                    spellId,
                    {
                        status: status,
                    }
                );
                console.log(result);
            } catch (err) {
                console.log(err);
            }
            await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
        });
        return composer;
    }
}
