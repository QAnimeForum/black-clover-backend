import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ProblemService } from 'src/modules/judicial.system/services/problem.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'typeorm';

@Injectable()
export class RequestToParlamentWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly problemService: ProblemService,
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.CREATE_REQUEST_TO_PARLAMENT_SCENE_ID,
            this.step1(),
            this.step2()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            console.log(ctx.scene.session.problem);
            await ctx.reply('Введите текст обращения.');
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Текст обращения не отправлен.');
            ctx.scene.enter(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const message = ctx.update?.message.text;
            const caption = `Ваш текст обращения: ${message}`;
            ctx.scene.session.problem = message;
            await ctx.reply(caption, {
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback('Отменить обращение', `CANCEL`),
                        Markup.button.callback(
                            'Отправить в приёмную',
                            `SEND_MESSAGE`
                        ),
                    ],
                ]),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Текст обращения не отправлен.');
            ctx.scene.enter(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID);
        });
        composer.action('SEND_MESSAGE', async (ctx) => {
            const character = await this.characterService.getCharacterIdByTgId(
                ctx.callbackQuery.from.id.toString()
            );
            await this.problemService.createProblem(
                character,
                ctx.scene.session.problem
            );
            await ctx.scene.enter(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID);
        });
        composer.action('CANCEL', async (ctx) => {
            await ctx.scene.enter(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID);
        });
        return composer;
    }
}
