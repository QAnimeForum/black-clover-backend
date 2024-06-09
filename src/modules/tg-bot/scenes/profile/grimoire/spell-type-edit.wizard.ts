import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { ENUM_SPELL_TYPE } from 'src/modules/grimoire/constants/spell.type.enum';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { Logger } from 'winston';

@Injectable()
export class SpellTypeEditWizard {
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
            ENUM_SCENES_ID.EDIT_SPELL_TYPE_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Выберите новый тип заклинания', {
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Магия созидания',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.CREATION
                        ),
                        Markup.button.callback(
                            'Магия исцеления',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.HEALING
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Магия усиления',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.REINFORCEMENT
                        ),
                        Markup.button.callback(
                            'Магия ограничения',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.RESTRAINING
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Печать',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.SEAL
                        ),
                        Markup.button.callback(
                            'Ловушка',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.TRAP
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Комибнированная магия',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.COMPOUND
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Запретная магия',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.FORBIDDEN
                        ),
                        Markup.button.callback(
                            'Проклятие',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.CURSE
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Другой вариант',
                            'MAGIC_TYPE:' + ENUM_SPELL_TYPE.OTHER
                        ),
                    ],
                ]),
            });
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        composer.action(/^(MAGIC_TYPE.*)$/, async (ctx) => {
            try {
                const spellId = ctx.session.spellId;
                const type = ctx.callbackQuery['data'].split(':')[1];
                await this.grimoireService.updateSpellType(spellId, {
                    type: type,
                });
            } catch (err) {
                console.log(err);
            }
            await ctx.scene.enter(ENUM_SCENES_ID.EDIT_GRIMOIRES_SCENE_ID);
        });
        return composer;
    }
}
