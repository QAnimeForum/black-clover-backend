import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'typeorm';

import { CharacterService } from 'src/modules/character/services/character.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { MarketEntity } from 'src/modules/items/entity/market.entity';
import { MarketService } from 'src/modules/items/service/market.service';

@Injectable()
export class CreateEquipmentItemWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        @Inject(CharacterService) private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.CREATE_EQUIPMENT_ITEM_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Введите название предмета:');
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Цели не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        return composer;
    }
}
