import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import {
    GRIMOURE_IMAGE_PATH,
    INVENTORY_IMAGE_PATH,
    KNIGHT_IMAGE_PATH,
} from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from '../../../character/services/character.service';
import { Markup } from 'telegraf';
import { GrimoireService } from '../../../grimoire/services/grimoire.service';
import {
    ALCOHOL_BUTTON,
    ARMOR_BUTTON,
    BACK_BUTTON,
    BACKGROUND_BUTTON,
    CREATE_SPELL_BUTTON,
    EDIT_GRIMOIRE_BUTTON,
    EDIT_MAGIC_NAME_BUTTON,
    EDIT_SPELL_BUTTON,
    GRIMOIRE_BUTTON,
    INVENTORY_BUTTON,
    MY_DEVILS_BUTTON,
    MY_SPIRITS_BUTTON,
    PARAMS_BUTTON,
    PROFILE_BUTTON,
    WALLET_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { SpellEntity } from 'src/modules/grimoire/entity/spell.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { fullProfileToText } from '../../utils/profile.utils';
import { spellToText } from '../../utils/grimoire.utils';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';

@Scene(ENUM_SCENES_ID.PROFILE_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ProfileScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly userService: UserService,
        private readonly grimoireService: GrimoireService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
    
        const chatType = ctx.chat.type;
        const senderId = sender.id;
        const username = sender.username;
        const isUserExist = await this.userService.exists(senderId);
        if (!isUserExist && chatType !== 'private') {
            await ctx.reply(
                'Мир Чёрного клевера вас не знает. Пожалуйста, перейдите в личные сообщения с ботом, для заполнения личной информации о себе.',
                {
                    ...Markup.inlineKeyboard([
                        Markup.button.url(
                            'Ссылка на бот',
                            'https://t.me/black_clover_role_play_bot'
                        ),
                    ]),
                }
            );
        }
        const character =
            await this.characterService.findFullCharacterInfoByTgId(senderId);
        const caption = fullProfileToText(character, username, senderId);
        if (chatType == 'private') {
            await ctx.sendPhoto(
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
                        [PROFILE_BUTTON, BACK_BUTTON],
                    ]).resize(),
                }
            );
            if (character.grimoire == null) {
                ctx.reply(
                    `Вы ещё не получили гримуар. Сходите в ближайшую башню, где выдают гримуары, и оставьте заявку на гримуар. \n (Перейдите во вкадку: ${GRIMOIRE_BUTTON})`
                );
            }
        } else {
            await ctx.sendPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                GRIMOIRE_BUTTON,
                                ENUM_ACTION_NAMES.GET_MY_GRIMOIRE_ACTION
                            ),
                            Markup.button.callback(
                                BACKGROUND_BUTTON,
                                ENUM_ACTION_NAMES.GET_MY_BACKGROUND_ACTION
                            ),
                        ],
                        [
                            Markup.button.callback(
                                INVENTORY_BUTTON,
                                ENUM_ACTION_NAMES.GET_MY_INVENTORY_ACTION
                            ),
                            Markup.button.callback(
                                WALLET_BUTTON,
                                ENUM_ACTION_NAMES.GET_MY_WALLET_ACTION
                            ),
                        ],
                    ]),
                }
            );
        }
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.GET_MY_GRIMOIRE_ACTION)
    @Hears(GRIMOIRE_BUTTON)
    async grimoire(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_SCENE_ID);
        /**
         *     const grimoire = await this.grimoireService.findGrimoireByUserTgId(
            sender.id
        );
        if (!grimoire) {
            await ctx.reply('У вас ещё нет гримуара');
            return;
        }

        const spells: Array<SpellEntity> = [];
        const title = '<strong><u>ГРИМУАР</u></strong>\n\n';
        const magicBlock = `<strong>Магия</strong>: ${grimoire.magicName}\n`;
        let caption = `${title}${magicBlock}<strong>Обложка</strong>: ${grimoire.coverSymbol}\n`;
        //<strong>Цвет магии</strong>: ${grimoire.magicColor}
        const spellListMessages: Array<{
            id: string;
            text: string;
        }> = [];
        if (spells.length === 0) {
            caption = caption.concat(`У вас нет заклинаний`);
        } else {
            let spellListBlock = '';
            spellListBlock = spellListBlock.concat(
                `<strong>Список заклинаний</strong>\n`
            );
            spells.map((spell, index) => {
                spellListBlock = spellListBlock.concat(
                    `${index + 1}) ${spell.name}\n`
                );
                const spellMessage = spellToText(spell, index + 1);
                spellListMessages.push({
                    id: spell.id,
                    text: spellMessage,
                });
            });
            caption = caption.concat(spellListBlock);
        }
        await ctx.sendPhoto(
            {
                source: GRIMOURE_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            CREATE_SPELL_BUTTON,
                            CREATE_SPELL_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            EDIT_MAGIC_NAME_BUTTON,
                            EDIT_MAGIC_NAME_BUTTON
                        ),
                    ],
                ]),
            }
        );
        spellListMessages.map(
            async (spell) =>
                await ctx.reply(spell.text, {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                EDIT_SPELL_BUTTON,
                                `EDIT_SPELL:${spell.id}`
                            ),
                        ],
                    ]),
                })
        );
         */
        //await ctx.scene.enter(ENUM_SCENES_ID.grimoire);
    }
    @Hears(BACKGROUND_BUTTON)
    async bioHears(@Ctx() ctx: BotContext) {
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.GET_MY_BACKGROUND_ACTION)
    async bio(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
    }
    @Hears(PARAMS_BUTTON)
    async params(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CHARACTER_PARAMETERS_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.GET_MY_WALLET_ACTION)
    @Hears(WALLET_BUTTON)
    async wallet(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.WALLET_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.GET_MY_INVENTORY_ACTION)
    @Hears(INVENTORY_BUTTON)
    async inventory(@Ctx() ctx: BotContext, @Sender() sender) {
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

    @Hears(EDIT_GRIMOIRE_BUTTON)
    async editGrimoire(@Ctx() ctx: BotContext) {
        ctx.reply('вы попали в меню редактирования гримуара', {
            ...Markup.keyboard([
                [CREATE_SPELL_BUTTON, EDIT_MAGIC_NAME_BUTTON],
                [BACK_BUTTON],
            ]),
        });
        /**
         *
         * @param ctx
         */
    }
    @Action(CREATE_SPELL_BUTTON)
    async createSpell(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_SPELL_FORM_SCENE_ID);
    }

    @Action(EDIT_MAGIC_NAME_BUTTON)
    async editMagicName(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_MAGIC_NAME_SCENE_ID);
    }
}



    /**
     * 
     * @param ctx         /**
         * 「🏷️」Имя: 

「❤️」Жизнь: 

⇒「🤪」Здравомыслие: 

⇒「🌀」Магическая сила: 

⇒「🗡️」Урон: 

⊨═══════════════════════⫤

⇒「🃏」Атрибут: 

⇒「🧨」Предметы: 

⇒「🤹」Оборудованные предметы: 

⇒「☄️」Заклинания: 

⇒「⚡」Бонус: 
         */
