import { BotContext } from '../../interfaces/bot.context';
import { CharacterService } from '../../../character/services/character.service';

import { Inject, Injectable, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
    Action,
    Context,
    Ctx,
    Hears,
    InjectBot,
    Message,
    On,
    SceneEnter,
    Sender,
    TELEGRAF_STAGE,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { Logger } from 'winston';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { MapService } from 'src/modules/map/service/map.service';
import { RaceService } from 'src/modules/race/race.service';
import { WORLD_MAP_IMAGE_PATH } from '../../constants/images';
import { CharacterCreateDto } from 'src/modules/character/dto/character.create.dto';
import { ValidateAnswerPipe } from '../../pipes/validate-answer.pipe';
import Joi from 'joi';
import { message } from 'telegraf/filters';
import { LOGGER_INFO } from '../../utils/logger';
import { GO_TO_HOME } from '../../constants/button-names.constant';
import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_ROLE_TYPE } from 'src/modules/user/constants/role.enum.constant';

//@Wizard(ENUM_SCENES_ID.createCharacter)
//@UseFilters(TelegrafExceptionFilter)

//@Wizard(ENUM_SCENES_ID.CREATE_CHARACTER_FORM_SCENE_ID)
//@UseFilters(TelegrafExceptionFilter)
@Injectable()
export class CharacterCreateWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly userService: UserService,
        private readonly characterService: CharacterService,
        private readonly raceService: RaceService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.CREATE_CHARACTER_FORM_SCENE_ID,
            this.start(),
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6()
        );

        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.character = {
                name: 'не заполнено',
                age: 15,
                sex: 'м',
                stateName: 'королевство Клевер',
                raceName: 'человек',
                magic: 'не заполнено',
            };
            await ctx.reply(
                'Привет, путешественник!\nЗаполните краткую информацию о себе',
                Markup.removeKeyboard()
            );
            await ctx.reply('Пора представиться! Введите своё имя.');
            ctx.wizard.next();
        });
        return composer;
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on(message('text'), async (ctx) => {
            const regex = /^[a-zA-Zа-я\-]{2,25}$/;
            const message = ctx.update?.message.text;
            if (regex.test(message)) {
                ctx.scene.session.character.name = message;
                await ctx.reply('Введите возраст. (Больше 15)');
                ctx.wizard.next();
            } else {
                await ctx.reply(
                    'Введите имя состоящее из русских или английских букв (от 2-х до 25 букв)'
                );
                ctx.wizard.back();
                ctx.wizard.selectStep(1);
            }
        });
        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on(message('text'), async (ctx) => {
            const message = ctx.update?.message.text;
            if (message.length < 1 || Number.isInteger(message)) {
                ctx.reply('возраст введён некорректно');
                ctx.wizard.back();
            }
            const age = Number(message);
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
        return composer;
    }

    step3() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on('callback_query', async (ctx) => {
            await ctx.answerCbQuery();
            ctx.scene.session.character.sex = ctx.update.callback_query['data'];
            const paginatedRaces = await this.raceService.findAll({
                path: '',
            });
            const buttons = paginatedRaces.data.map((item) => [
                { text: item.name, callback_data: `${item.id}:${item.name}` },
            ]);
            let description = '';
            paginatedRaces.data.map((race) => {
                description += `<strong><u>${race.name}</u></strong>\n<u>Характеристики</u>\nБонусы к hp:${race.bonusHp}\nБонусы к маг. силе:${race.bonusMagicPower}\n Использование природной маны: ${race.naturalMana ? 'да' : 'нет'}\n\n`;
            });
            /**
             *  ${race.description}\n  <u>Характеристики</u>\nБонусы к hp:${race.bonusHp}\nБонусы к маг. силе:${race.bonusMagicPower}\n${race.naturalMana}\n
             */
            console.log(description);
            await ctx.sendPhoto(
                {
                    source: WORLD_MAP_IMAGE_PATH,
                },
                {
                    caption: `Тебе предстоит выбрать одну из рас из списка ниже, облик которой ты примешь на просторах Чёрного клевера!\n ${description}`,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: buttons,
                    },
                }
            );
            ctx.wizard.next();
        });
        return composer;
    }

    step4() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on('callback_query', async (ctx) => {
            await ctx.answerCbQuery();
            console.log(ctx.update.callback_query['data']);
            const data = ctx.update.callback_query['data'].split(':');
            ctx.scene.session.character.raceId = data[0];
            ctx.scene.session.character.raceName = data[1];
            const paginateStates = await this.mapService.findAllStates({
                path: '',
            });
            const buttons = paginateStates.data.map((item) => [
                {
                    text: item.fullName,
                    callback_data: `${item.id}:${item.name}`,
                },
            ]);
            let caption = 'Выбери страну, в которой ты родился, путник! \n';
            paginateStates.data.map((state) => (caption += `${state.name}`));
            await ctx.sendPhoto(
                {
                    source: WORLD_MAP_IMAGE_PATH,
                },
                {
                    caption: caption,
                    reply_markup: {
                        inline_keyboard: buttons,
                    },
                }
            );
            ctx.wizard.next();
        });
        return composer;
    }
    step5() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on('callback_query', async (ctx) => {
            //    await ctx.answerCbQuery();
            const data = ctx.update.callback_query['data'].split(':');
            ctx.scene.session.character.stateId = data[0];
            ctx.scene.session.character.stateName = data[1];

            const user = await this.userService.createUser({
                tgUserId: ctx.update.callback_query.from.id.toString(),
                character: {
                    name: ctx.scene.session.character.name,
                    age: ctx.scene.session.character.age,
                    sex: ctx.scene.session.character.sex,
                    raceId: ctx.scene.session.character.raceId,
                    stateId: ctx.scene.session.character.stateId,
                },
                role: ENUM_ROLE_TYPE.USER,
            });
            console.log(user);
            this.logger.log(
                LOGGER_INFO,
                `🟢 Пользователь успешно создал персонажа. * { name: ${ctx.update.callback_query.from.first_name} id: ${ctx.update.callback_query.from.id}}`
            );
            const title = `<strong><u>Ваш базовый профиль</u></strong>\n`;
            const nameLine = `<strong>Имя</strong>: ${ctx.scene.session.character.name}\n`;
            const ageLine = `<strong>Возраст</strong>: ${ctx.scene.session.character.age}\n`;
            const sexLine = `<strong>Пол</strong>: ${ctx.scene.session.character.sex}\n`;
            const stateLine = `<strong>Страна рождения</strong>: ${ctx.scene.session.character.stateName}\n`;
            const raceLine = `<strong>Раса</strong>: ${ctx.scene.session.character.raceName}\n`;
            const content = `${title}\n${nameLine}${ageLine}${sexLine}${stateLine}${raceLine}\n`;
            await ctx.reply(content, {
                parse_mode: 'HTML',
            });
            const afterCreateMessage =
                'Поздравляем, вы заполнили базувую информацию о себе. Но у вас всё ещё нет магического атрибута и гримуара. Для большинства активностей требуется гримуар. \n\nДля того, чтобы получить гиримуар, перейдите в главном меню во вкладку: `📕 Гримуар`.';
            await ctx.reply(afterCreateMessage, {
                ...Markup.keyboard([[GO_TO_HOME]]).resize(),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step6() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.hears(GO_TO_HOME, async (ctx) => {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
        });

        return composer;
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
