import { Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';

@Scene(SceneIds.characterParameters)
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
        const hpBlock = `<strong>♥️</strong>: ${characteristics.currentHealth}/${characteristics.maxHealth}\n`;
        const magicPowerBlock = `<strong>Магичесая сила</strong>: 500/500\n`;
        const strengthBlock = `<strong>${characteristics.strength.abbr}${characteristics.strength.name}</strong>: ${characteristics.strength.score}\n`;
        const dexterityBlock = `<strong>${characteristics.dexterity.abbr}${characteristics.dexterity.name}</strong>: ${characteristics.dexterity.score}\n`;
        const constitutionBlock = `<strong>${characteristics.constitution.abbr}${characteristics.constitution.name}</strong>: ${characteristics.constitution.score}\n`;
        const intelligenceBlock = `<strong>${characteristics.intelligence.abbr}${characteristics.intelligence.name}</strong>: ${characteristics.intelligence.score}\n`;
        const wisdomBlock = `<strong>${characteristics.wisdom.abbr}${characteristics.wisdom.name}</strong>: ${characteristics.wisdom.score}\n`;
        const charismaBlock = `<strong>${characteristics.charisma.abbr}${characteristics.charisma.name}</strong>: ${characteristics.charisma.score}\n`;
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
                    [
                        BUTTON_ACTIONS.grimoire,
                        BUTTON_ACTIONS.BIO,
                        BUTTON_ACTIONS.params,
                    ],
                    [BUTTON_ACTIONS.WALLET, BUTTON_ACTIONS.INVENTORY],
                    [BUTTON_ACTIONS.myDevils, BUTTON_ACTIONS.mySpirits],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
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
