import { BotContext } from '../../interfaces/bot.context';
import { CharacterService } from '../../../character/services/character.service';

import { Inject, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
    Context,
    Hears,
    Message,
    On,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { Logger } from 'winston';

//@Wizard(ENUM_SCENES_ID.createCharacter)
//@UseFilters(TelegrafExceptionFilter)

@Wizard(ENUM_SCENES_ID.CREATE_CHARACTER_FORM_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class CharacterCreateWizard {
    constructor(
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        await ctx.reply(
            'Привет, путешественник!\nЗаполните краткую информацию о себе'
        );
        await ctx.reply('Пора представиться! Напишите своё имя.');
    }

    @WizardStep(1)
    @On(['text'])
    async changeName(
        @Context() ctx: BotContext,
        @Sender('id') id,
        @Message('text') msg: string
    ) {
        ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
    }

    @WizardStep(2)
    @On(['text'])
    async saveCharacter(
        @Context() ctx: BotContext,
        @Sender('id') id,
        @Message('text') msg: string
    ) {
        ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
    @Hears(/^\/?(cancel)$/i)
    async onCancel(@Context() ctx: BotContext) {
        await ctx.reply('Имя не изменено.');
        await ctx.scene.leave();
    }
}

/**
 * @Injectable()
export class CreateCharacterWizard {

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
        this.steps = [
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6(),
            this.step7(),
        ];
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.createCharacter,
            ...this.steps
        );
    
        this.stage.register(this.scene);
        bot.use(stage.middleware());
        bot.catch((err: Error, ctx) => {
            console.log(err);
    
        });
    }

    step1() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.reply(
                    'Привет, путешественник!\nЗаполните краткую информацию о себе'
                );
                await ctx.reply('Пора представиться! Напишите своё имя.');
                ctx.wizard.next();
            });
        });
    }

    step2() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                if (msg.length < 1) {
                    ctx.reply(
                        'Пожалуйста, введите имя, состоящее хотя бы из одного символа.'
                    );
                    return;
                }
                ctx.scene.session.character = {
                    name: msg,
                    age: 15,
                    sex: '',
                    state: '',
                    race: '',
                    magic: '',
                };
                const paginateStates = await this.mapService.findAllStates({
                    path: '',
                });
                const buttons = paginateStates.data.map((item) => [
                    { text: item.fullName, callback_data: item.id },
                ]);
                ctx.sendPhoto(
                    {
                        source: WORLD_MAP_IMAGE_PATH,
                    },
                    {
                        caption: 'Выбери страну, в которой ты родился, путник!',
                        reply_markup: {
                            inline_keyboard: buttons,
                        },
                    }
                );
                ctx.wizard.next();
            });
        });
    }

    step3() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    ctx.scene.session.character.state = ctx.callbackQuery.data;
                } else ctx.scene.leave();
                const paginatedRaces = await this.raceService.findAll({
                    path: '',
                });
                const buttons = paginatedRaces.data.map((item) => [
                    { text: item.name, callback_data: item.id },
                ]);
                ctx.sendPhoto(
                    {
                        source: WORLD_MAP_IMAGE_PATH,
                    },
                    {
                        caption:
                            'Тебе предстоит выбрать одну из трех рас, облик которой ты примешь на просторах Чёрного клевера!',
                        reply_markup: {
                            inline_keyboard: buttons,
                        },
                    }
                );
                ctx.wizard.next();
            });
        });
    }

    step4() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    ctx.scene.session.character.race = ctx.callbackQuery.data;
                } else ctx.scene.leave();

                ctx.reply('Ведите возраст персонажа');
                ctx.wizard.next();
            });
        });
    }

    step5() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                if (msg.length < 1 || Number.isInteger(msg)) {
                    ctx.reply('возраст введён некорректно');
                    ctx.wizard.back();
                }
                const age = Number(msg);
                if (age < 15) {
                    ctx.reply('вам должно быть больше 15');
                    ctx.wizard.back();
                }
                ctx.scene.session.character.age = age;
                ctx.reply('Выберите пол персонажа', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'м', callback_data: 'м' },
                                { text: 'ж', callback_data: 'ж' },
                            ],
                        ],
                    },
                });
                ctx.wizard.next();
            });
        });
    }
    step6() {
        return this.tgBotService.createComposer((composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    ctx.scene.session.character.sex = ctx.callbackQuery.data;
                } else ctx.scene.leave();

                ctx.reply('Введите желаемый магический атрибут');
                ctx.wizard.next();
            });
        });
    }

    step7() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                const character = (
                    await this.characterService.createPlayableCharacterDto({
                        name: ctx.scene.session.character.name,
                        sex: ctx.scene.session.character.sex,
                        age: ctx.scene.session.character.age,
                        raceId: ctx.scene.session.character.race,
                        countryId: ctx.scene.session.character.state,
                        magic: msg,
                    })
                ).raw[0];
                const dto = {
                    tgUserId: String(ctx.from.id),
                    character: character,
                    role: ENUM_ROLE_TYPE.USER,
                };
                this.userService.createUser(dto);
                ctx.scene.enter(ENUM_SCENES_ID.home);
            });
        });
    }
}
 */

/**
 * 
 * /*
 * 
 * 
 * 
 *   await ctx.scene.leave();
                /**
                 *   Markup.inlineKeyboard([
                        [Markup.button.url('Как выглядит гримуар', RULES)],
                        [
                            Markup.button.callback(
                                'Выбрать магию и её "цветовую гамму"',
                                'CHOSE_MAGIC'
                            ),
                        ],
                        [Markup.button.callback('Мне надо подумать', 'EXIT')],
                    ])
                 
                const race = await this.raceService.getRaceById(
                    ctx.scene.session.character.race
                );
                const state = await this.mapService.findStateById(
                    ctx.scene.session.character.state
                );*/
/**
 * 
                const title = `Проверьте, правильно ли заполнили базувую информацию о себе\n`;
                const nameLine = `<strong>Имя</strong>: ${ctx.scene.session.character.name}\n`;
                const ageLine = `<strong>Возраст</strong>: ${ctx.scene.session.character.age}\n`;
                const sexLine = `<strong>Пол</strong>: ${ctx.scene.session.character.sex}\n`;
                const stateLine = `<strong>Страна происхождения</strong>: ${state.name}\n`;
                const raceLine = `<strong>Раса</strong>: ${race.name}\n`;
                const content = `${title}\n${nameLine}${ageLine}${sexLine}${stateLine}${raceLine}\n`;
                await ctx.answerCbQuery();
 
  step7() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    switch (ctx.callbackQuery.data) {
                        case 'EXIT': {
                            ctx.scene.enter(ENUM_SCENES_ID.home);
                            break;
                        }
                    }
                } else ctx.scene.leave();

                //ctx.reply(ctx.i18n.t(LanguageTexts.character_create_age));
                await ctx.scene.leave();
            });
        });
    }

/**
 * 
    /**
     * 
     * @returns        reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Шаблон гримуара',
                                    url: SAMPLE_GRIMOURE_URL,
                                },
                                {
                                    text: 'Шаблон заклинания',
                                    url: SAMPLE_SPELL_URL,
                                },
                            ],
                            [
                                {
                                    text: 'Создать гримуар самому и отравить его на проверку админу',
                                    callback_data: 'create_a_grimoire_yourself',
                                },
                            ],
                            [
                                {
                                    text: 'Выбрать только магический атрибут ',
                                    callback_data: 'create_a_grimoire_yourself',
                                },
                            ],
                            [
                                {
                                    text: 'Админы сделают за вас всё',
                                    callback_data: 'admins_create_grimoure',
                                },
                            ],
                            [
                                {
                                    text: ctx.i18n.t(
                                        LanguageTexts.grimoire_think
                                    ),
                                    callback_data: 'admins_create_grimoure',
                                },
                            ],
                        ],
                    },
 */
/**
 * ctx.wizard.state.characterData.goal = ctx.message.text;
 * async(ctx) => {
    await ctx.answerCbQuery();
    ctx.wizard.state.characterData.sex =ctx.update.callback_query.data;;
    ctx.reply('Пожалуйста, введите характер персонажа:');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.characterData.character = ctx.message.text;
    ctx.reply('Пожалуйста, введите увлечения:');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.characterData.hobbies = ctx.message.text;
    ctx.reply('Пожалуйста, введите любимые цитаты, если есть:');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.characterData.quotes = ctx.message.text;
    ctx.reply('Пожалуйста, введите введите биографию персонажа:');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.characterData.bio = ctx.message.text;
    ctx.reply('Пожалуйста, введите введите цель персонажа:');
    return ctx.wizard.next();
  },
 */

/**
 * Общие данные: 

Полных лет: 309
Рост: 6 фут. (183 см.)
Вес: 160 фунт. (72 кг.)
Кожа: алебастровая 
Глаза: сияющие золотом
Взгляд: злой
Прическа: аккуратная прическа с жгутами и косами
Цвет волос: пепельно-белые
Лицо: худое
Растительность на лице: отсутствует
Особенности: исполосованная спина, рассеченная бровь, один глаз не видит, рассеченная бровь

Размер:  
Скорость: 30
Языки: Общий, Эльфийский, Подземный

Предыстория персонажа:
Преступник 
Направленность - Карманник

Черта характера - Наилучший способ заставить меня сделать что-то ? сказать мне этого не делать.
Идеал - Милосердие. Я краду у богачей, чтобы помочь людям в беде.
Привязанность - Я виновен в ужасающем преступлении. Надеюсь, я смогу простить себя за это.
Слабость - Когда я становлюсь перед выбором между друзьями и деньгами, я обычно выбираю деньги.

Владение инструментами: Воровские инструменты, один игровой набор.

 
    КД: 4
    ХП: 0 из 0
    Вр ХП: 0 
    
    Статы:
    
    Сила: 10 (0)
    Ловкость: 10 (0)
    Телосложение: 10 (0)
    Интеллект: 10 (0)
    Мудрость: 10 (0)
    Харизма: 10 (0)
     
    Инициатива: 0
    Бонус мастерства: 0
    Скорость: 0 фт
    Пасс\. Внимательность: 0
    
    Спасброски:
    Мудрость и Харизма
    
    Навыки:
    Религия
    Запугивание
    Внимание
 */
