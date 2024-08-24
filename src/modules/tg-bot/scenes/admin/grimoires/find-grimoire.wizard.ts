import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'winston';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import fs from 'fs';
import { GRIMOIRE_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { grimoireToText } from 'src/modules/tg-bot/utils/grimoire.utils';
import { LOGGER_ERROR, LOGGER_INFO } from 'src/modules/tg-bot/utils/logger';
@Injectable()
export class FindGrimoireByTgIdWizard {
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
            ENUM_SCENES_ID.FIND_GRIMOIRE_BY_TG_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply(
                `🧟 Введи  ID игрока, чей гримуар хотите посмотреть.\n(Для отмены поиска нажмите /cancel)`,
                {
                    parse_mode: 'HTML',
                    ...Markup.removeKeyboard(),
                }
            );
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Вы отменили поиск гримуара.');
            ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const message = Number.parseInt(ctx.update?.message.text);
            if (Number.isNaN(message)) {
                await ctx.reply(
                    `❗️Введён неккоректный id {${ctx.update?.message.text}}.`
                );
                await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
                return;
            }
            const character =
                await this.grimoireService.findCharacterWithGrimoireByUserTgId(
                    message
                );
            if (!character || !character.grimoire) {
                await ctx.reply(
                    `❗️ Системе не удалось найти гримуар пользователя с id {${message}}.`
                );
                this.logger.log(
                    LOGGER_ERROR,
                    `🔴 Системе не удалось найти гримуар пользователя с id {${message}}.`
                );
            } else if (character.grimoire) {
                this.logger.log(
                    LOGGER_INFO,
                    `🟢 Гримуар пользователя * { ${message} } успешно найден`
                );
                const caption = grimoireToText(character);
                const avatar = `${process.env.APP_API_URL}/${character.grimoire.coverImagePath}`;
                await ctx.sendPhoto(
                    {
                        source: fs.existsSync(avatar)
                            ? avatar
                            : GRIMOIRE_IMAGE_PATH,
                    },
                    {
                        caption: caption,
                        parse_mode: 'HTML',
                    }
                );
            } else {
                await ctx.reply(
                    `❗️ Системе не удалось найти гримуар пользователя с id {${message}}.`
                );
                this.logger.log(
                    LOGGER_ERROR,
                    `🔴 Системе не удалось найти гримуар пользователя с id {${message}}.`
                );
            }
            await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
        });
        return composer;
    }
}
