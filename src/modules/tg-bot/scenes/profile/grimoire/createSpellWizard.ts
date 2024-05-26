import {
    SceneEnter,
    Wizard,
    Context,
    Hears,
    WizardStep,
    Message,
    On,
} from 'nestjs-telegraf';
import { UseFilters } from '@nestjs/common';
import { GrimoireService } from '../../../../grimoire/services/grimoire.service';
import { SceneIds } from '../../../constants/scenes.id';
import { BotContext } from '../../../interfaces/bot.context';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { ENUM_SPELL_TYPE } from 'src/modules/grimoire/constants/spell.type.enum';
import { Logger } from 'winston';
import { Markup } from 'telegraf';

@Wizard(SceneIds.createSpell)
@UseFilters(TelegrafExceptionFilter)
export class CreateSpellWizard {
    constructor(private readonly grimoireService: GrimoireService) {}
    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        ctx.scene.session.spell = {
            name: 'не заполнено',
            description: 'не заполнено',
            type: ENUM_SPELL_TYPE.OTHER,
            damage: 0,
            range: 'не заполнено',
            duration: 'не заполнено',
            cost: 0,
            castTime: 1,
            cooldown: 0,
            goals: 'не заполнено',
            minLevel: 1,
            requipments: [],
        };
        const title = '<strong><u>Шаблон заклинания</u></strong>';
        const name = `<strong>Название: </strong>`;
        const type = `<strong>Тип: </strong>`;
        const damage = '<strong>Урон: </strong>';
        const range = '<strong>Область действия заклинания: </strong>';
        const duration = '<strong>Продолжительность: </strong>';
        const cost = '<strong>Стоимость: </strong>';
        const castTime =
            '<strong>Сколько времени нужно для создания заклинания: </strong>';
        const cooldown = '<strong>Время отката заклинания: </strong>';
        const goals = '<strong>Цели: </strong>';
        const minLevel = '<strong>Минимальный уровень персонажа: </strong>';
        const requipments = '<strong>Требования: </strong>';
        const description = `<strong>Описание</strong>`;
        const template = `${title}\n${name}\n${type}\n${damage}\n${range}\n${duration}\n${cost}\n${castTime}\n${cooldown}\b${goals}\n${minLevel}\n${requipments}${description}`;
        await ctx.reply(template, {
            parse_mode: 'HTML',
        });

        await ctx.reply(
            'Давайте заполним форму.\nДля того, чтобы выйти из формы, нажмите на "/cancel (черновик заклинания сохранится)". \n\nНазвание заклинания'
        );
        ctx.wizard.next();
    }

    @WizardStep(1)
    async step1(@Context() ctx: BotContext, @Message('text') text: string) {
        ctx.scene.session.spell.name = text;
        await ctx.reply('Тип заклинания', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Магия созидания',
                        ENUM_SPELL_TYPE.CREATION
                    ),
                    Markup.button.callback(
                        'Магия исцеления',
                        ENUM_SPELL_TYPE.HEALING
                    ),
                ],
                [
                    Markup.button.callback(
                        'Магия усиления',
                        ENUM_SPELL_TYPE.REINFORCEMENT
                    ),
                    Markup.button.callback(
                        'Магия ограничения',
                        ENUM_SPELL_TYPE.RESTRAINING
                    ),
                ],
                [
                    Markup.button.callback('Печать', ENUM_SPELL_TYPE.SEAL),
                    Markup.button.callback('Ловушка', ENUM_SPELL_TYPE.TRAP),
                ],
                [
                    Markup.button.callback(
                        'Комибнированная магия',
                        ENUM_SPELL_TYPE.COMPOUND
                    ),
                    Markup.button.callback(
                        'Магия проклятий',
                        ENUM_SPELL_TYPE.CURSE
                    ),
                ],
                [
                    Markup.button.callback(
                        'Запретная магия',
                        ENUM_SPELL_TYPE.FORBIDDEN
                    ),
                    Markup.button.callback('Проклятие', ENUM_SPELL_TYPE.CURSE),
                ],
                [
                    Markup.button.callback(
                        'Другой вариант',
                        ENUM_SPELL_TYPE.OTHER
                    ),
                ],
            ]),
        });
        ctx.wizard.next();
    }

    @On('callback_query')
    @WizardStep(2)
    async step2(@Context() ctx: BotContext) {
        try {
            ctx.scene.session.spell.type = ctx.callbackQuery['data'];
        } catch (err) {
            console.log(err);
        }
        await ctx.reply('Описание заклинания');
        ctx.wizard.next();
    }

    @On('callback_query')
    @WizardStep(3)
    async step3(@Context() ctx: BotContext, @Message('text') text: string) {
        ctx.scene.session.spell.description = text;
        await ctx.reply('Урон заклинания');
        ctx.wizard.next();
    }

    @WizardStep(4)
    async step4(@Context() ctx: BotContext , @Message('text') text: string) {
        ctx.scene.session.spell.damage = text;
        await ctx.reply(
            'Область действия заклинания заклинания\n(Пример: не определено/на самого персонажа/в области на опрелеённом расстоянии персонажа)'
        );
        ctx.wizard.next();
    }

    @WizardStep(5)
    async step5(@Context() ctx: BotContext, @Message('text') text: string) {
        ctx.scene.session.spell = text;
        await ctx.reply('Продолжительность заклинания \n ()');
        ctx.wizard.next();
    }

    @WizardStep(6)
    async step6(@Context() ctx: BotContext, @Message('text') text: string) {
        ctx.scene.session.spell.castTime = text;
        await ctx.reply('Затраты магической силы');
        ctx.wizard.next();
    }

    @WizardStep(7)
    async step7(@Context() ctx: BotContext, @Message('text') text: string) {
        await ctx.reply(
            'Сколько времени нужно для создания заклинания \n (Пример: мгновенно/)'
        );
        ctx.wizard.next();
    }

    @WizardStep(8)
    async step8(@Context() ctx: BotContext, @Message('text') text: string) {
        await ctx.reply('Время отката заклинания:');
        ctx.wizard.next();
    }
    @WizardStep(9)
    async step9(@Context() ctx: BotContext, @Message('text') text: string) {
        await ctx.reply(
            'Цели заклинания. (не опредено/сам пользователь/до 3-х людей в доступном диапазоне)'
        );
        ctx.wizard.next();
    }
    @WizardStep(10)
    async step10(@Context() ctx: BotContext, @Message('text') text: string) {
        await ctx.reply('Минимальный уровень персонажа для каста заклинания');
        ctx.wizard.next();
    }
    @WizardStep(11)
    async step11(@Context() ctx: BotContext, @Message('text') text: string) {
        await ctx.reply('Дополнительные требования для заклинания');
        ctx.wizard.next();
    }

    @WizardStep(12)
    async exit(@Context() ctx: BotContext) {
        ctx.scene.leave();
    }
    @Hears(/^\/?(cancel)$/i)
    async onCancel(@Context() ctx: BotContext) {
        await ctx.reply('Создание заклинания отменено');
        await ctx.scene.leave();
    }
}

/*


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

        this.scene = new Scenes.WizardScene<BotContext>(
            SceneIds.createSpell,
            this.start(),
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6(),
            this.exit(),
        );
    
        this.stage.register(this.scene);
        bot.use(stage.middleware());
        bot.catch((err: Error, ctx) => {
            console.log(err);
    
        });
    }

    start() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                ctx.scene.session.spell = {
                    name: '',
                    description: '',
                    damage: 0,
                    range: '',
                    duration: '',
                    cost: 0,
                    castTime: 1,
                    cooldown: 0,
                    type: ENUM_SPELL_TYPE.CREATION,
                    goals: '',
                    minLevel: 1,
                    requipments: [],
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
*/
