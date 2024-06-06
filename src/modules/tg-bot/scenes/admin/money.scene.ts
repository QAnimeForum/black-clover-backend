import {
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Wizard,
    WizardStep,
    Command,
    Action,
} from 'nestjs-telegraf';
import { ADMIN_IMAGE_PATH } from '../../constants/images';

import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { UserService } from 'src/modules/user/services/user.service';

import {
    ANNOUNCEMENTS_BUTTON,
    BACK_BUTTON,
    CHRONICLE_BUTTON,
    FINE_MONEY_BUTTON,
    GIVE_MONEY_BUTTON,
    GRIMOIRE_BUTTON,
    GRIMOIRES_BUTTON,
    MONEY_BUTTON,
    PERMITIONS_BUTTON,
    TRANSACTIONS_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AnnouncementService } from 'src/modules/events/services/announcement.service';
import { MoneyService } from 'src/modules/money/money.service';
@Scene(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminMoneyScene {
    constructor(
        private readonly mondeyService: MoneyService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        ctx.reply('Управление финансами', {
            ...Markup.keyboard([
                [TRANSACTIONS_BUTTON],
                [GIVE_MONEY_BUTTON, FINE_MONEY_BUTTON],
                [BACK_BUTTON],
            ]).resize(),
        });
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
