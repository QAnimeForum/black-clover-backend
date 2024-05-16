import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Inject, Injectable } from '@nestjs/common';
import { Telegraf, Scenes, Composer } from 'telegraf';
import { message } from 'telegraf/filters';
import { GrimoireService } from '../../../../grimoire/services/grimoire.service';
import { SceneIds } from '../../../constants/scenes.id';
import { BotContext } from '../../../interfaces/bot.context';
import { TgBotService } from '../../../services/tg-bot.service';

@Injectable()
export class CreateSpellWizard {
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
        this.steps = [
            this.start(),
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6(),
            this.exit(),
        ];
        this.scene = new Scenes.WizardScene<BotContext>(
            SceneIds.createSpell,
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
                ctx.scene.session.spell = {
                    name: '',
                    description: '',
                    range: '',
                    duration: '',
                    cost: '',
                    castTime: '',
                };
                await ctx.reply('Введите название заклинания');
                ctx.wizard.next();
            });
        });
    }

    step1() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.name = msg;
                await ctx.reply('Введите описание заклинания:');
                ctx.wizard.next();
            });
        });
    }
    step2() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.range = msg;
                await ctx.reply('Введите время каста заклинания:');
                ctx.wizard.next();
            });
        });
    }
    step3() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.castTime = msg;
                await ctx.reply('Введите дальность заклинания:');
                ctx.wizard.next();
            });
        });
    }

    step4() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.cost = msg;
                await ctx.reply(
                    ' Пожалуйста, введите продолжительность заклинания:'
                );
                ctx.wizard.next();
            });
        });
    }
    step5() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.duration = msg;
                await ctx.reply('Пожалуйста, введите затраты маны:');
                ctx.wizard.next();
            });
        });
    }

    step6() {
        return this.tgBotService.createComposer((composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.description = msg;
                const content = `Проверьте, вы правильно заполнили параметры заклинания\n\nНазвание заклинания:${ctx.scene.session.spell.name}\nОписание заклинания:${ctx.scene.session.spell.description}`;
                await ctx.reply(content, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'да', callback_data: '1' },
                                { text: 'да', callback_data: '1' },
                            ],
                        ],
                    },
                });
                await ctx.wizard.next();
            });
        });
    }
    exit() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                switch (ctx.updateType) {
                    case 'callback_query': {
                        await ctx.answerCbQuery();
                        if ('data' in ctx.callbackQuery) {
                            const grimoire =
                                await this.grimoireService.findGrimoireByUserTgId(
                                    ctx.callbackQuery.from.id.toString()
                                );
                            await this.grimoireService.createSpell(
                                ctx.scene.session.spell,
                                grimoire
                            );
                            await ctx.scene.enter(SceneIds.grimoire);
                        } else ctx.scene.leave();
                        break;
                    }
                    case 'message': {
                        ctx.scene.leave();
                        break;
                    }
                    case 'inline_query': {
                        ctx.scene.leave();
                        break;
                    }
                }
            });
        });
    }
}
