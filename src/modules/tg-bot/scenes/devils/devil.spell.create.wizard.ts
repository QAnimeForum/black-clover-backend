import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { DevilsService } from 'src/modules/devils/services/devils.service';
import { ENUM_SPELL_TYPE } from 'src/modules/grimoire/constants/spell.type.enum';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { ENUM_HELP_DOCUMENTATION } from 'src/modules/tg-bot/constants/help.constant';

import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { LOGGER_INFO } from 'src/modules/tg-bot/utils/logger';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'winston';

@Injectable()
export class DevilSpellCreateWizard {
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
            ENUM_SCENES_ID.CREATE__DEVIL_SPELL_FORM_SCENE_ID,
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6(),
            this.step7(),
            this.step8(),
            this.step9()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);

        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.spell = {
                name: 'не заполнено',
                description: 'не заполнено',
                type: ENUM_SPELL_TYPE.DEVIL_UNION,
                damage: '0',
                range: 'не заполнено',
                duration: 'не заполнено',
                cost: '0',
                castTime: '1',
                cooldown: '0',
                goals: 'не заполнено',
                minLevel: 1,
                requipments: 'нет',
                grimoireId: null,
            };
            const caption =
                '<strong><u>Шаблон заклинания</u></strong>\nДля выхода из формы нажмите на /cancel.\n Черновик сохранится';
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.url(
                            'Шаблон',
                            ENUM_HELP_DOCUMENTATION.SPELL_TEMPLATE
                        ),
                    ],
                ]),
            });
            await ctx.reply('Введите название заклинания.\n');
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.name = ctx.update.message.text;
            await ctx.reply('Описание заклинания');
            ctx.wizard.next();
        });
        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.description = ctx.update.message.text;
            await ctx.reply('Урон заклинания (целое число > 0)');
            ctx.wizard.next();
        });
        return composer;
    }

    step3() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.damage = ctx.update.message.text;
            await ctx.reply(
                'Область действия заклинания заклинания\n(Пример: не определено/на самого персонажа/в радиусе 5 метров на всех)'
            );
            ctx.wizard.next();
        });
        return composer;
    }

    step4() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.range = ctx.update.message.text;
            await ctx.reply(
                'Максимальная продолжительность заклинания \n (в минутах)'
            );
            ctx.wizard.next();
        });
        return composer;
    }

    step5() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.duration = ctx.update.message.text;
            await ctx.reply('Затраты магической силы');
            ctx.wizard.next();
        });
        return composer;
    }

    step6() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.grimoireService.createSpell(ctx.scene.session.spell);
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.cost = ctx.update.message.text;
            await ctx.reply('Время каста заклинания \n (Пример: в секундах');
            ctx.wizard.next();
        });
        return composer;
    }

    step7() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.castTime = ctx.update.message.text;
            await ctx.reply('Время отката заклинания:');
            ctx.wizard.next();
        });
        return composer;
    }

    step8() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.castTime = ctx.update.message.text;
            await ctx.reply(
                'Цели заклинания. \n(Пример: не опредено/сам пользователь/до 3-х людей в доступном диапазоне)'
            );
            ctx.wizard.next();
        });
        return composer;
    }
    /*
    step10() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.grimoireService.createSpell(ctx.scene.session.spell);
             ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.goals = ctx.update.message.text;
            await ctx.reply(
                'Минимальный уровень персонажа для возможности использования заклинания.'
            );
            ctx.wizard.next();
        });
        return composer;
    }

    step11() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.grimoireService.createSpell(ctx.scene.session.spell);
             ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.spell.minLevel = Number.parseInt(
                ctx.update.message.text
            );
            await ctx.reply('Дополнительные требования для заклинания');
            ctx.wizard.next();
        });
        return composer;
    }*/

    step9() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');
            await this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );
            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            //     ctx.scene.session.spell.requipments = ctx.update.message.text;
            ctx.scene.session.spell.goals = ctx.update.message.text;
            const spell = ctx.scene.session.spell;
            const title = '<strong><u>Заклинание</u></strong>';
            const name = `<strong>Название: </strong> ${spell.name}`;
            const type = `<strong>Тип: </strong> ${spell.type}`;
            const damage = `<strong>Урон: </strong> ${spell.damage}`;
            const range = `<strong>Область действия заклинания: </strong> ${spell.range}`;
            const duration = `<strong>Продолжительность: </strong> ${spell.duration}`;
            const cost = `<strong>Затраты маг.силы.: </strong> ${spell.cost}`;
            const castTime = `<strong>Сколько времени нужно для создания заклинания: </strong> ${spell.castTime}`;
            const cooldown = `<strong>Время отката заклинания: </strong> ${spell.cooldown}`;
            const goals = `<strong>Цели:</strong> ${spell.goals}`;
            const minLevel = `<strong>Минимальный уровень персонажа: </strong> ${spell.minLevel}`;
            const requipments = '<strong>Требования: </strong>';
            const description = `<strong>Описание</strong>\n ${spell.description}`;
            const template = `${title}\n${name}\n${type}\n${damage}\n${range}\n${duration}\n${cost}\n${castTime}\n${cooldown}\n${goals}\n${minLevel}\n${requipments}\n${description}`;
            await ctx.reply(template, {
                parse_mode: 'HTML',
            });

            await this.devilService.createSpell(
                ctx.scene.session.spell,
                ctx.session.devilCreateSpellDto.devilId,
                ctx.session.devilCreateSpellDto.percent
            );

            ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        return composer;
    }
}
