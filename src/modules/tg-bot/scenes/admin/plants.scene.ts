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

import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AnnouncementService } from 'src/modules/events/services/announcement.service';
import { PlantService } from 'src/modules/plants/services/plant.service';
import {
    BACK_BUTTON,
    BACKGROUND_BUTTON,
} from '../../constants/button-names.constant';
@Scene(ENUM_SCENES_ID.PLANTS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class PlantsService {
    constructor(
        private readonly plantsService: PlantService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const plants = await this.plantsService.findAllPlants();
        for (const plant of plants) {
            const plantMessage = `ID: ${plant.id}\nНазвание: ${plant.name}\nЭмодзи: ${plant.emojiIcon}\nОписание: ${plant.description}\nСтоимость:денег, \nВремя засыхания: ${plant.deathTime}`;
            ctx.reply(
                plantMessage,
                Markup.inlineKeyboard([
                    Markup.button.callback(
                        `Удалить ${plant.name}`,
                        `delete_plant_${plant.id}`
                    ),
                ])
            );
        }

        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Добавить растение', 'add_plant'),
            Markup.button.callback(BACK_BUTTON, BACK_BUTTON),
        ]);
        ctx.reply('Выберите действие:', keyboard);
    }

    @Action('add_plant')
    addPlant(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.CREATE_PLANT_SCENE_ID);
    }

    @Action(BACK_BUTTON)
    back(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.PLANTS_SCENE_ID);
    }
}
