import { Context, SceneEnter, Wizard, WizardStep } from 'nestjs-telegraf';
import { WORLD_MAP_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { MapService } from 'src/app/modules/map/service/map.service';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

@Wizard(SceneIds.map)
@UseFilters(TelegrafExceptionFilter)
export class MapWizard {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly mapService: MapService
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        const dto: any = {
            _search: undefined,
            _limit: 20,
            _offset: 0,
            _order: { name: 'ASC' },
            _availableOrderBy: ['name'],
            _availableOrderDirection: [
                ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
                ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
            ],
        };
        const [states] = await this.mapService.getAllStates(dto);
        await ctx.replyWithPhoto(
            { source: WORLD_MAP_IMAGE_PATH },
            {
                caption: 'выберите, куда вы хотите отправиться',
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: states.map((state) => [
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
                    const dto: any = {
                        _search: undefined,
                        _limit: 20,
                        _offset: 0,
                        _order: { name: 'ASC' },
                        _availableOrderBy: ['fullName'],
                        _availableOrderDirection: [
                            ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
                            ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
                        ],
                    };
                    const [provinces] =
                        await this.mapService.getProvincesByState(
                            ctx.callbackQuery.data,
                            dto
                        );
                    await ctx.replyWithPhoto(
                        { source: WORLD_MAP_IMAGE_PATH },
                        {
                            caption: 'выберите, куда вы хотите отправиться',
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: provinces.map((state) => [
                                    {
                                        text: state.fullName,
                                        callback_data: state.id,
                                    },
                                ]),
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
                    const dto: any = {
                        _search: undefined,
                        _limit: 20,
                        _offset: 0,
                        _order: { name: 'ASC' },
                        _availableOrderBy: ['name'],
                        _availableOrderDirection: [
                            ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
                            ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
                        ],
                    };
                    const [provinces] =
                        await this.mapService.getBurgsByProvince(
                            ctx.callbackQuery.data,
                            dto
                        );
                    await ctx.replyWithPhoto(
                        { source: WORLD_MAP_IMAGE_PATH },
                        {
                            caption: 'выберите, куда вы хотите отправиться',
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: provinces.map((state) => [
                                    {
                                        text: state.name,
                                        callback_data: state.id,
                                    },
                                ]),
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
