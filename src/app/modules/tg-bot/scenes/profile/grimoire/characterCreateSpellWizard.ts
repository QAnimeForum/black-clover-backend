import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';

import { SceneIds } from '../../constants/scenes.id';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { Inject, Injectable } from '@nestjs/common';
import { LanguageTexts } from '../../constants/language.text.constant';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { MapService } from 'src/app/modules/map/service/map.service';
import { RaceService } from 'src/app/modules/race/race.service';
import { Telegraf, Scenes, Composer } from 'telegraf';
import { UserService } from 'src/app/modules/user/services/user.service';
import { message } from 'telegraf/filters';
import { GrimoireService } from 'src/app/modules/grimoire/services/grimoire.service';

//@Wizard(SceneIds.createCharacter)
//@UseFilters(TelegrafExceptionFilter)
@Injectable()
export class CreateSpellWizard {
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
                await ctx.reply(ctx.i18n.t(LanguageTexts.spell_create_name));
                ctx.wizard.next();
            });
        });
    }

    step1() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.name = msg;
                await ctx.reply(ctx.i18n.t(LanguageTexts.spell_create_range));
                ctx.wizard.next();
            });
        });
    }
    step2() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.range = msg;
                await ctx.reply(
                    ctx.i18n.t(LanguageTexts.spell_create_cast_time)
                );
                ctx.wizard.next();
            });
        });
    }
    step3() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.range = msg;
                await ctx.reply(ctx.i18n.t(LanguageTexts.spell_create_cost));
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
                    ctx.i18n.t(LanguageTexts.spell_create_duration)
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
                await ctx.reply(
                    ctx.i18n.t(LanguageTexts.spell_create_description)
                );
                ctx.wizard.next();
            });
        });
    }

    step6() {
        return this.tgBotService.createComposer((composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                ctx.scene.session.spell.description = msg;
                const content = `${ctx.i18n.t(LanguageTexts.spell_create_check_information)}${ctx.i18n.t(LanguageTexts.spell_name)}${ctx.scene.session.spell.name}${ctx.i18n.t(LanguageTexts.spell_cast_time)}${ctx.scene.session.spell.castTime}${ctx.i18n.t(LanguageTexts.spell_cost)}${ctx.scene.session.spell.cost}${ctx.i18n.t(LanguageTexts.spell_cost)}${ctx.scene.session.spell.duration}${ctx.i18n.t(LanguageTexts.spell_range)}${ctx.scene.session.spell.range}${ctx.i18n.t(LanguageTexts.spell_description)}${ctx.scene.session.spell.description}`;
                ctx.reply(content, {
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
                        if ('data' in ctx.callbackQuery) {
                            console.log(ctx.callbackQuery);
                            const grimoire =
                                await this.grimoireService.findGrimoireByUserId(
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
