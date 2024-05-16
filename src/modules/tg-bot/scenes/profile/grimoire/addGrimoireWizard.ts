import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';

import { Inject, Injectable } from '@nestjs/common';
import { CharacterService } from '../../../../character/services/character.service';
import { MapService } from '../../../../map/service/map.service';
import { RaceService } from '../../../../race/race.service';
import { Telegraf, Scenes, Composer } from 'telegraf';
import { UserService } from '../../../../user/services/user.service';
import { message } from 'telegraf/filters';
import { SceneIds } from '../../../constants/scenes.id';
import { BotContext } from '../../../interfaces/bot.context';
import { TgBotService } from '../../../services/tg-bot.service';

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
        private readonly characterService: CharacterService,
        private readonly mapService: MapService,
        private readonly raceService: RaceService,
        private readonly userService: UserService,
        private readonly tgBotService: TgBotService
    ) {
        // Create scene and add steps
        this.steps = [
            this.start(),
            this.step1(),
            this.step2(),
            this.step3(),
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
                await ctx.reply('Сейчас вы будете создавать заклинание!');
                await ctx.reply('Введите название заклинания:');
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
                await ctx.reply(
                   'Введите количество урона, которое наносит заклинание:'
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
                await ctx.reply('Пожалуйста, введите затраты магической силы:');
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
                   'Пожалуйста, введите продолжительность заклинания:'
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
                'Введите описание заклинания:'
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
                const content = `Проверьте, вы правильно заполнили параметры заклинания\nНазвание${ctx.scene.session.spell.name}Время каста:${ctx.scene.session.spell.castTime}\nСтоимость заклинания${ctx.scene.session.spell.cost}\nПродолжительность:${ctx.scene.session.spell.duration}\тДиапазон${ctx.scene.session.spell.range}\nОписание\n\n${ctx.scene.session.spell.description}`;
                ctx.reply(content, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'да', callback_data: '1' },
                                { text: 'да (пока)', callback_data: '1' },
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
