import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { GrimoireService } from '../../../../grimoire/services/grimoire.service';
import { GRIMOIRE_IMAGE_PATH } from '../../../constants/images';
import { TelegrafExceptionFilter } from '../../../filters/tg-bot.filter';
import { BotContext } from '../../../interfaces/bot.context';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
    BACK_BUTTON,
    EDIT_GRIMOIRE_COVER_BUTTON,
    EDIT_SPELL_BUTTON,
    EDIT_SPELL_CHANGE_STATUS_BUTTON,
    GRIMOIRE_BUTTON,
    GRIMOIRE_STATISTICS_BUTTON,
    GRIMOIRE_TOWER_BUTTON,
    SHOW_FULL_GRIMOIRE,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { GrimoireEntity } from 'src/modules/grimoire/entity/grimoire.entity';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import {
    grimoireStatisticsToText,
    grimoireStatusToText,
    grimoireToText,
    spellToText,
} from 'src/modules/tg-bot/utils/grimoire.utils';
import fs from 'fs';
@Scene(ENUM_SCENES_ID.GRIMOIRE_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class GrimoireScene {
    constructor(
        private readonly grimoireService: GrimoireService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender('id') tgId: number) {
        const type = ctx.chat.type;
        const grimoire: GrimoireEntity =
            await this.grimoireService.findGrimoireByUserTgId(tgId);
        if (!grimoire) {
            if (type == 'private') {
                await ctx.reply(
                    'У вас нет гримуара!\n\n Перейдите в башню гримуаров, чтобы получить гримуар',
                    {
                        reply_markup: 'HTML',
                        ...Markup.inlineKeyboard([
                            [
                                Markup.button.callback(
                                    GRIMOIRE_TOWER_BUTTON,
                                    ENUM_ACTION_NAMES.GO_TO_GRIMOIRE_TOWER_ACTION
                                ),
                            ],
                            [
                                Markup.button.callback(
                                    BACK_BUTTON,
                                    ENUM_ACTION_NAMES.BACK_TO_PROFILE_ACTION
                                ),
                            ],
                        ]),
                    }
                );
            } else {
                await ctx.reply(
                    'У вас нет гримуара!\n\n Перейдите в башню гримуаров, чтобы получить гримуар',
                    {
                        reply_markup: 'HTML',
                        ...Markup.inlineKeyboard([
                            [
                                Markup.button.callback(
                                    GRIMOIRE_TOWER_BUTTON,
                                    ENUM_ACTION_NAMES.GO_TO_GRIMOIRE_TOWER_ACTION
                                ),
                            ],
                            [
                                Markup.button.callback(
                                    BACK_BUTTON,
                                    ENUM_ACTION_NAMES.BACK_TO_PROFILE_ACTION
                                ),
                            ],
                        ]),
                    }
                );
            }
            return;
        }
        const title = '<strong><u>ГРИМУАР</u></strong>\n\n';
        const magicBlock = `<strong>Магия</strong>: ${grimoire.magicName}\n`;
        const statusBlock = `<strong>Статус</strong>: ${grimoireStatusToText(grimoire.status)}\n`;
        const coverBlock = `<strong>Обложка</strong>: ${grimoire.coverSymbol}\n`;
        let caption = `${title}${magicBlock}${coverBlock}${statusBlock}\n`;
        caption += '<strong>Заклинания</strong>\n';
        const spells = grimoire.spells;
        spells.map((spell, index) => {
            caption += `${index + 1}) ${spell.name}\n`;
        });
        if (ctx.chat.type == 'private') {
            const avatar = `${process.env.APP_API_URL}/${grimoire.coverImagePath}`;
            await ctx.sendPhoto(
                {
                    source: fs.existsSync(avatar)
                        ? avatar
                        : GRIMOIRE_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [GRIMOIRE_STATISTICS_BUTTON, SHOW_FULL_GRIMOIRE],
                        [GRIMOIRE_BUTTON, EDIT_GRIMOIRE_COVER_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            const avatar = `${process.env.APP_API_URL}/${grimoire.coverImagePath}`;
            await ctx.sendPhoto(
                {
                    source: fs.existsSync(avatar)
                        ? avatar
                        : GRIMOIRE_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                GRIMOIRE_STATISTICS_BUTTON,
                                GRIMOIRE_STATISTICS_BUTTON
                            ),
                        ],
                        [
                            Markup.button.callback(
                                SHOW_FULL_GRIMOIRE,
                                SHOW_FULL_GRIMOIRE
                            ),
                        ],
                    ]),
                }
            );
        }
    }

    @Hears(GRIMOIRE_STATISTICS_BUTTON)
    async grimoireStatistics(
        @Ctx() ctx: BotContext,
        @Sender('id') tgId: number
    ) {
        const grimoire: GrimoireEntity =
            await this.grimoireService.findGrimoireByUserTgId(tgId);
        const caption = grimoireStatisticsToText(grimoire);
        await ctx.replyWithHTML(caption);
    }
    @Hears(GRIMOIRE_BUTTON)
    async grimoire(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        const character =
            await this.grimoireService.findCharacterWithGrimoireByUserTgId(
                tgId
            );

        const caption = grimoireToText(character);
        const avatar = `${process.env.APP_API_URL}/${character.grimoire.coverImagePath}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : GRIMOIRE_IMAGE_PATH,
            },
            {
                parse_mode: 'HTML',
                caption,
            }
        );
    }

    @Hears(SHOW_FULL_GRIMOIRE)
    async showFullGrimoire(@Ctx() ctx: BotContext, @Sender('id') tgId: number) {
        const grimoire =
            await this.grimoireService.findGrimoireByUserTgId(tgId);
        const spells = grimoire.spells;
        const title = '<strong><u>ГРИМУАР</u></strong>\n\n';
        const magicBlock = `<strong>Магия</strong>: ${grimoire.magicName}\n`;
        const statusBlock = `<strong>Статус</strong>: ${grimoireStatusToText(grimoire.status)}\n`;
        const coverBlock = `<strong>Обложка</strong>: ${grimoire.coverSymbol}\n`;
        let caption = `${title}${magicBlock}${coverBlock}${statusBlock}\n`;
        const spellListMessages: Array<{
            id: string;
            text: string;
        }> = [];
        if (spells.length === 0) {
            caption = caption.concat(
                `<strong><u>ЗАКЛИНАНИЯ</u></strong>\nУ вас нет заклинаний\n`
            );
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
        const avatar = `${process.env.APP_API_URL}/${grimoire.coverImagePath}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : GRIMOIRE_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
            }
        );
        spellListMessages.map(
            async (message) =>
                await ctx.reply(message.text, {
                    parse_mode: 'HTML',
                })
        );
    }
    @Hears(EDIT_GRIMOIRE_COVER_BUTTON)
    async editGrimoireCover(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_GRIMOIRE_COVER_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.GO_TO_GRIMOIRE_TOWER_ACTION)
    async grimoireTower(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_TOWER_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_PROFILE_ACTION)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async back(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
