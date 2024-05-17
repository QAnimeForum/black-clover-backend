import { Context, SceneEnter, Wizard, WizardStep } from 'nestjs-telegraf';
import { WORLD_MAP_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { MapService } from '../../../map/service/map.service';

@Wizard(SceneIds.map)
@UseFilters(TelegrafExceptionFilter)
export class MapWizard {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly mapService: MapService
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        const paginateStates = await this.mapService.findAllStates({
            path: '',
        });
        await ctx.replyWithPhoto(
            { source: WORLD_MAP_IMAGE_PATH },
            {
                caption: 'выберите, куда вы хотите отправиться',
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: paginateStates.data.map((state) => [
                        { text: state.fullName, callback_data: state.id },
                    ]),
                },
            }
        );
    }

    @WizardStep(1)
    async provinces(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const paginatedProvinces =
                        await this.mapService.findAllPrivinces({
                            path: '',
                            filter: {
                                state_id: ctx.callbackQuery.data,
                            },
                        });
                    await ctx.replyWithPhoto(
                        { source: WORLD_MAP_IMAGE_PATH },
                        {
                            caption: 'выберите, куда вы хотите отправиться',
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: paginatedProvinces.data.map(
                                    (state) => [
                                        {
                                            text: state.fullName,
                                            callback_data: state.id,
                                        },
                                    ]
                                ),
                            },
                        }
                    );
                    ctx.wizard.next();
                } else await ctx.scene.leave();
                break;
            }
            case 'message': {
                await ctx.scene.leave();
                break;
            }
            case 'inline_query': {
                await ctx.scene.leave();
                break;
            }
        }
    }

    @WizardStep(2)
    async burgs(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    const paginatedProvinces =
                        await this.mapService.findAllBurgs({
                            path: '',
                            filter: {
                                province_id: ctx.callbackQuery.data,
                            },
                        });
                    await ctx.replyWithPhoto(
                        { source: WORLD_MAP_IMAGE_PATH },
                        {
                            caption: 'выберите, куда вы хотите отправиться',
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: paginatedProvinces.data.map(
                                    (state) => [
                                        {
                                            text: state.name,
                                            callback_data: state.id,
                                        },
                                    ]
                                ),
                            },
                        }
                    );
                    ctx.wizard.next();
                } else await ctx.scene.leave();
                break;
            }
            case 'message': {
                await ctx.scene.leave();
                break;
            }
            case 'inline_query': {
                await ctx.scene.leave();
                break;
            }
        }
    }
}
