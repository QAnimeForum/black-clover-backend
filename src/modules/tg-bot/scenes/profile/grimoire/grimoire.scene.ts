import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { GrimoireService } from '../../../../grimoire/services/grimoire.service';
import { GRIMOURE_IMAGE_PATH } from '../../../constants/images';
import { TelegrafExceptionFilter } from '../../../filters/tg-bot.filter';
import { BotContext } from '../../../interfaces/bot.context';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
    BACK_BUTTON,
    CREATE_SPELL_BUTTON,
    EDIT_GRIMOIRE_BUTTON,
    EDIT_MAGIC_NAME_BUTTON,
    EDIT_SPELL_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';

@Scene(ENUM_SCENES_ID.GRIMOIRE_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class GrimoreScene {
    constructor(
        private readonly grimoireService: GrimoireService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        const grimoire =
            await this.grimoireService.findGrimoireByUserTgId(tgId);
        const spells = grimoire.spells;
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
                const title = `<strong><u>Заклинание ${index + 1}</u></strong>\n`;
                const nameBlock = `<strong>Название</strong>: ${spell.name}\n`;
                const costBlock = `<strong>Стоимость заклинания</strong>: ${spell.cost}\n`;
                const castTImeBlock = `<strong>Время каста заклинания</strong>: ${spell.castTime}\n`;
                const durationBlock = `<strong>Продолжительность заклинания</strong>: ${spell.duration}\n`;
                const rangeBlock = `<strong>Дальность заклинания</strong>: ${spell.range}\n`;
                const descriptionBlock = `<strong>Описание</strong>\n${spell.description}\n`;
                const spellMessage = `${title}${nameBlock}${costBlock}${castTImeBlock}${durationBlock}${rangeBlock}${descriptionBlock}\n\n`;
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
    }

    @Hears(EDIT_GRIMOIRE_BUTTON)
    async editGrimoire(@Ctx() ctx: BotContext) {
        ctx.reply('вы попали в меню редактирования гримуара', {
            ...Markup.keyboard([
                [CREATE_SPELL_BUTTON, EDIT_MAGIC_NAME_BUTTON],
                [BACK_BUTTON],
            ]),
        });
    }
    @Action(CREATE_SPELL_BUTTON)
    async createSpell(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_SPELL_FORM_SCENE_ID);
    }

    @Action(EDIT_MAGIC_NAME_BUTTON)
    async editMagicName(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_MAGIC_NAME_SCENE_ID);
    }

    @Hears(BACK_BUTTON)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
