import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { GRIMOIRE_TOWER_PATH, KNIGHT_IMAGE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, UseFilters } from '@nestjs/common';
import { CharacterService } from '../../../character/services/character.service';
import { Markup } from 'telegraf';
import { MapService } from '../../../map/service/map.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Logger } from 'winston';
import {
    ADMIN_CREATE_GRIMOIRE_BUTTON,
    BACK_BUTTON,
    COME_UP_WITH_MAGICAL_ATTRIBUTE_BUTTON,
    FIND_GRIMOIRE_BY_TG_BUTTON,
    GRIMOIRE_GET_BUTTON,
    GRIMOIRE_LIST_BUTTON,
} from '../../constants/button-names.constant';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import {
    convertGrimoiresToTextAndInlineButtons,
    grimoireInlineKeyboard,
    grimoireToText,
} from '../../utils/grimoire.utils';
import { GrimoireEntity } from 'src/modules/grimoire/entity/grimoire.entity';
import {
    BACK_TO_GRIMOIRE_LIST_REQEX,
    ENUM_ACTION_NAMES,
    GRIMOIRE_INFO_REGEX,
    GRIMOIRE_NEXT_PAGE_REGEX,
    GRIMOIRE_PREVIOUS_PAGE_REGEX,
} from '../../constants/action-names.constant';
import { GrmoireWorkerService } from 'src/modules/grimoire/services/grimoire.worker.service';

@Scene(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class GrimoireTowerScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly grimoireWorkerService: GrmoireWorkerService,
        private readonly grimoireService: GrimoireService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async showEnterMessage(ctx: BotContext, id: number) {
        let caption =
            '🏰Башня гримуаров\n\n Здесь вы можете получить гримуар и выучить заклинания.\n\n';
        const chatType = ctx.chat.type;
        const grimoireWorkers =
            await this.grimoireWorkerService.findAllGrimoireWorkers({
                path: '',
            });
        const totalGrimoires = await this.grimoireService.countGrimoires();
        caption += '<strong>Сотрудники башни гримуаров</strong>\n';
        grimoireWorkers.data.map((worker, index) => {
            caption += `${index + 1}) ${worker.character.background.name}\n`;
        });
        if (grimoireWorkers.data.length == 0) {
            caption +=
                'В башне никто пока не работает, большое упущение!\nВы можете стать сотрудником башни грумуаров (заявки подаются через админов)\n\n';
        }
        caption += `<strong>Общее количество гримуаров:</strong> ${totalGrimoires}\n\n`;
        if (chatType == 'private') {
            await ctx.replyWithPhoto(
                {
                    source: GRIMOIRE_TOWER_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [GRIMOIRE_GET_BUTTON],
                        [GRIMOIRE_LIST_BUTTON, FIND_GRIMOIRE_BY_TG_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            /*  const paginatedGrimoires =
            await this.grimoireService.findAllGrimoires({
                path: '',
            });
        const { text, buttons } =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        caption += text;*/

            const buttons = [
                [
                    Markup.button.callback(
                        GRIMOIRE_LIST_BUTTON,
                        ENUM_ACTION_NAMES.GRIMOIRE_LIST_ACTION
                    ),
                ],
            ];
            const hasGrimoire = await this.grimoireService.hasGrimoire(id);
            if (hasGrimoire) {
                buttons.push([
                    Markup.button.callback(
                        GRIMOIRE_LIST_BUTTON,
                        ENUM_ACTION_NAMES.GRIMOIRE_LIST_ACTION
                    ),
                ]);
            } else {
                buttons.push([
                    Markup.button.callback(
                        GRIMOIRE_GET_BUTTON,
                        ENUM_ACTION_NAMES.GET_GRIMOIRE_ACTION
                    ),
                ]);
            }
            await ctx.replyWithPhoto(
                {
                    source: GRIMOIRE_TOWER_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard(buttons),
                }
            );
        }
    }
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        this.showEnterMessage(ctx, sender.id);
    }

    @Action(ENUM_ACTION_NAMES.GRIMOIRE_LIST_ACTION)
    @Hears(GRIMOIRE_LIST_BUTTON)
    async findByGrimoireList(@Ctx() ctx: BotContext) {
        let page = 1;
        if (ctx.callbackQuery) {
            ctx.answerCbQuery();
            page = ctx.callbackQuery['data'].split(':')[1];
        }

        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
            limit: 5,
            page: page,
        });
        const { text, buttons } =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
            ),
        ]);
        await ctx.deleteMessage();
        await ctx.replyWithPhoto(
            {
                source: GRIMOIRE_TOWER_PATH,
            },
            {
                caption: text,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(BACK_TO_GRIMOIRE_LIST_REQEX)
    async findByGrimoireList1(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);
        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
            limit: 5,
            page: page,
        });
        const { text, buttons } =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
            ),
        ]);
        await ctx.deleteMessage();
        await ctx.replyWithPhoto(
            {
                source: GRIMOIRE_TOWER_PATH,
            },
            {
                caption: text,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.GET_GRIMOIRE_ACTION)
    async getGrimoire(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
      await this.showChooseMenu(ctx);
    }
    @Action(GRIMOIRE_INFO_REGEX)
    async showGrimoire(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            ctx.answerCbQuery();
            const selectedGrimoireId = ctx.callbackQuery.data.split(':')[1];
            const currentPage = ctx.callbackQuery.data.split(':')[2];
            ctx.session.grimoireId = selectedGrimoireId;
            const grimoire =
                await this.grimoireService.findGrimoireById(selectedGrimoireId);
            const caption = grimoireToText(grimoire);
            await ctx.editMessageCaption(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    Markup.button.callback(
                        BACK_BUTTON,
                        `${ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_LIST_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage}`
                    ),
                ]),
            });
        }
    }

    @Action(GRIMOIRE_NEXT_PAGE_REGEX)
    async nextPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);

        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
            sortBy: [['id', 'ASC']],
            limit: 5,
            page: page,
        });
        const { text, buttons } =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(GRIMOIRE_PREVIOUS_PAGE_REGEX)
    async previousPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);
        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
            sortBy: [['id', 'ASC']],
            limit: 5,
            page: page,
        });

        const { text, buttons } =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
            ),
        ]);
        await ctx.editMessageCaption(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION)
    async backToGrimoireTower(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.answerCbQuery();
        await ctx.deleteMessage();
        this.showEnterMessage(ctx, sender.id);
    }
    @Action(BACK_BUTTON)
    async grimoireList(@Ctx() ctx: BotContext) {
        if (ctx.callbackQuery) {
            ctx.answerCbQuery();
        }
        ctx.session.grimoireId == null;
        ctx.session.spellId == null;
        const paginatedGrimoires = await this.grimoireService.findAllGrimoires({
            path: '',
        });
        const { text, buttons } =
            convertGrimoiresToTextAndInlineButtons(paginatedGrimoires);
        await ctx.editMessageText(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Hears(GRIMOIRE_GET_BUTTON)
    public async wantGrimoire(@Ctx() ctx: BotContext) {
        await this.showChooseMenu(ctx);
    }

    showChooseMenu = async (ctx: BotContext) => {
        await ctx.replyWithPhoto(
            {
                source: GRIMOIRE_TOWER_PATH,
            },
            {
                caption: 'Способы получить гримуар',
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.url(
                            'Система гримуаров',
                            'https://telegra.ph/Grimuar-i-zaklinaniya-02-03'
                        ),
                    ],
                    [
                        Markup.button.callback(
                            COME_UP_WITH_MAGICAL_ATTRIBUTE_BUTTON,
                            ENUM_ACTION_NAMES.COME_UP_WITH_MAGICAL_ATTRIBUTE_ACTION,
                        ),
                    ],
                    [
                        Markup.button.callback(
                            ADMIN_CREATE_GRIMOIRE_BUTTON,
                            ENUM_ACTION_NAMES.ADMIN_CREATE_GRIMOIRE_ACTION
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_GRIMOIRE_TOWER_ACTION
                        ),
                    ],
                ]),
            }
        );
    };
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}
