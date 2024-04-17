import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { INVENTORY_IMAGE_PATH } from '../../constants/images';

@Scene(SceneIds.inventory)
@UseFilters(TelegrafExceptionFilter)
export class InventoryScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService,
        private readonly userService: UserService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Ваш инвентарь';
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.MINERALS,
                            BUTTON_ACTIONS.MINERALS
                        ),
                    ],
                ]),
            }
        );
    }
    /**
 * 
 * @param ctx                 ...Markup.keyboard([
                    [BUTTON_ACTIONS.MINERALS, BUTTON_ACTIONS.JEWEIRY],
                    [BUTTON_ACTIONS.FOOD, BUTTON_ACTIONS.ALCOHOL],
                    [BUTTON_ACTIONS.WEAPONS, BUTTON_ACTIONS.ARMOR],
                    [BUTTON_ACTIONS.GEARS, BUTTON_ACTIONS.VEHICLES],
                    [BUTTON_ACTIONS.ALL_INVENTORY],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
 */
    @Action(BUTTON_ACTIONS.MINERALS)
    async minrals(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список минералов, которые у вас есть</strong>\n\n';
        const not = 'У вас нет минералов';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(BUTTON_ACTIONS.JEWEIRY)
    async jeweiry(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список ювелирных изделий, которые у вас есть</strong>\n\n';
        const not = 'У вас нет ювелирки';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(BUTTON_ACTIONS.FOOD)
    async food(@Ctx() ctx: BotContext) {
        const title = '<strong>Список еды, которые у вас есть</strong>\n\n';
        const not = 'У вас нет еды';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }

    @Hears(BUTTON_ACTIONS.WEAPONS)
    async weapon(@Ctx() ctx: BotContext) {
        const title = '<strong>Список оружия, которые у вас есть</strong>\n\n';
        const not = 'У вас нет оружия';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(BUTTON_ACTIONS.ARMOR)
    async armor(@Ctx() ctx: BotContext) {
        const title = '<strong>Список бпони, которое у вас есть</strong>\n\n';
        const not = 'У вас нет брони';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(BUTTON_ACTIONS.GEARS)
    async gears(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список механизмов, которые у вас есть</strong>\n\n';
        const not = 'У вас нет механизмов';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(BUTTON_ACTIONS.VEHICLES)
    async vehicles(@Ctx() ctx: BotContext) {
        const title =
            '<strong>Список средств передвижения, которые у вас есть</strong>\n\n';
        const not = 'У вас нет средств передвижения';
        const caption = title + not;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }
    @Hears(BUTTON_ACTIONS.grimoire)
    async grimoire(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoire);
    }
    @Hears(BUTTON_ACTIONS.BIO)
    async bio(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.bio);
    }
    @Hears(BUTTON_ACTIONS.params)
    async params(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.characterParameters);
    }
    @Hears(BUTTON_ACTIONS.WALLET)
    async wallet(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.wallet);
    }
    @Hears(BUTTON_ACTIONS.INVENTORY)
    async inventory(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.inventory);
    }
    @Hears(BUTTON_ACTIONS.myDevils)
    async myDevils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.myDevils);
    }

    @Hears(BUTTON_ACTIONS.mySpirits)
    async mySpirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.mySpirits);
    }
}
