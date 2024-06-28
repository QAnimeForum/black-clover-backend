import { Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { CharacterService } from '../../../character/services/character.service';
import { UserService } from '../../../user/services/user.service';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';
import {
    BACK_BUTTON,
    BACKGROUND_BUTTON,
    GRIMOIRE_BUTTON,
    INVENTORY_BUTTON,
    MY_DEVILS_BUTTON,
    MY_SPIRITS_BUTTON,
    PARAMS_BUTTON,
    WALLET_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';

@Scene(ENUM_SCENES_ID.CHARACTER_PARAMETERS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class CharacterParamsScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService,
        private readonly userService: UserService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const senderId = sender.id;
        const character =
            await this.characterService.findFullCharacterInfoByTgId(senderId);
        const characteristics = character.characterCharacteristics;
        const levelBlock = `<strong>Уровень персонажа</strong>: ${characteristics.currentLevel}/${characteristics.maxLevel}\n`;
        const hpBlock = `<strong>♥️Уровень здоровья</strong>: ${characteristics.currentHealth}/${characteristics.maxHealth}\n`;
        const magicPowerBlock = `<strong>🌀Магическая сила</strong>: 500/500\n`;
        const strengthBlock = `<strong>💪Сила</strong>: ${characteristics.strength.score}\n`;
        const dexterityBlock = `<strong>🏃Ловкость</strong>: ${characteristics.dexterity.score}\n`;
        const constitutionBlock = `<strong>🏋️Телосложение</strong>: ${characteristics.constitution.score}\n`;
        const intelligenceBlock = `<strong>🎓Интеллект</strong>: ${characteristics.intelligence.score}\n`;
        const wisdomBlock = `<strong>📚Мудрость</strong>: ${characteristics.wisdom.score}\n`;
        const charismaBlock = `<strong>🗣Харизма</strong>: ${characteristics.charisma.score}\n`;
        //   const armorClassBlock = `${characteristics.armorClass.}${characteristics.armorClassBlock.name}${characteristics.armorClassBlock.score}`;
        const characteristicsTitle = `\n<strong><u>Характеристики персонажа</u></strong>\n\n`;
        const characteristicsBlock = `${characteristicsTitle}${levelBlock}${hpBlock}${magicPowerBlock}${strengthBlock}${dexterityBlock}${constitutionBlock}${intelligenceBlock}${wisdomBlock}${charismaBlock}`;
        const caption = `${characteristicsBlock}`;

        ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [GRIMOIRE_BUTTON, BACKGROUND_BUTTON, PARAMS_BUTTON],
                    [WALLET_BUTTON, INVENTORY_BUTTON],
                    [MY_DEVILS_BUTTON, MY_SPIRITS_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }
    @Hears(GRIMOIRE_BUTTON)
    async grimoire(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_SCENE_ID);
    }
    @Hears(BACKGROUND_BUTTON)
    async bio(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
    }
    @Hears(PARAMS_BUTTON)
    async params(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CHARACTER_PARAMETERS_SCENE_ID);
    }
    @Hears(WALLET_BUTTON)
    async wallet(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.WALLET_SCENE_ID);
    }
    @Hears(INVENTORY_BUTTON)
    async inventory(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.INVENTORY_SCENE_ID);
    }
    @Hears(MY_DEVILS_BUTTON)
    async myDevils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MY_DEVILS_SCENE_ID);
    }

    @Hears(MY_SPIRITS_BUTTON)
    async mySpirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MY_SPIRITS_SCENE_ID);
    }
}
