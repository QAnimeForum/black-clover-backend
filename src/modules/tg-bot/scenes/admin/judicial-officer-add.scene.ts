import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { BackgroundService } from 'src/modules/character/services/background.service';
import { Scenes, Composer, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'typeorm';
import { EDIT_GOALS_BUTTON } from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { BotContext } from '../../interfaces/bot.context';
import { LOGGER_INFO } from '../../utils/logger';
import { GrmoireWorkerService } from 'src/modules/grimoire/services/grimoire.worker.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import { CourtWorkerService } from 'src/modules/judicial.system/services/court.worker.service';

@Injectable()
export class JudicialOfficerAddWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly characterService: CharacterService,
        @Inject(CourtWorkerService)
        private readonly courtWorkerService: CourtWorkerService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.JUDICIAL_OFFICER_ADD_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply(
                `🧟 Введи ID игрока, которого хотите удалить из башни гримуаров.`
            );
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Цели не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const regex = /^[a-zA-Zа-яА_Я\-]{2,25}$/;
            const message = ctx.update?.message.text;
            const character =
                await this.characterService.findCharacterByTgId(message);
            try {
                const curtWorker =
                    await this.courtWorkerService.createCourtWorker(
                        character.id
                    );
                this.logger.log(
                    LOGGER_INFO,
                    `🟢 Работник башни гримуаров успешно добавлен. * { id: ${message}}`
                );
                ctx.scene.enter(
                    ENUM_SCENES_ID.ADMIN_MAGIC_PARLAMENT_SCENE_SCENE_ID
                );
            } catch (err) {
                await ctx.reply(
                    'не удалось добавить пользователя с таким id попробуйте ещё раз'
                );
                ctx.wizard.back();
            }
        });
        return composer;
    }
}
