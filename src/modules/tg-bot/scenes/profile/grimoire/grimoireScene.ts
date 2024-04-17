import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { GrimoireService } from 'src/app/modules/grimoire/services/grimoire.service';
import { BUTTON_ACTIONS } from '../../../constants/actions';
import { GRIMOURE_IMAGE_PATH } from '../../../constants/images';
import { SceneIds } from '../../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../../filters/tg-bot.filter';
import { BotContext } from '../../../interfaces/bot.context';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

@Scene(SceneIds.grimoire)
@UseFilters(TelegrafExceptionFilter)
export class GrimoreScene {
    constructor(private readonly grimoireService: GrimoireService) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const grimoire = await this.grimoireService.findGrimoireByUserId(
            sender.id
        );
        const [spellEntities] = await this.grimoireService.findAllSpells(
            {
                _search: undefined,
                _limit: 20,
                _offset: 0,
                _order: { name: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC },
                _availableOrderBy: ['name'],
                _availableOrderDirection: [
                    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
                    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
                ],
            },
            grimoire.id
        );

        const title = '<strong><u>ГРИМУАР</u></strong>\n\n';
        const magicBlock = `<strong>Магия</strong>: ${grimoire.magicName}\n`;
        let caption = `${title}${magicBlock}<strong>Обложка</strong>: ${grimoire.coverSymbol}\n<strong>Цвет магии</strong>: ${grimoire.magicColor}\n`;
        const spellListMessages: Array<{
            id: string;
            text: string;
        }> = [];
        if (spellEntities.length === 0) {
            caption = caption.concat(`У вас нет заклинаний`);
        } else {
            let spellListBlock = '';
            spellListBlock = spellListBlock.concat(
                `<strong>Список заклинаний</strong>\n`
            );
            spellEntities.map((spell, index) => {
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
                            BUTTON_ACTIONS.CREATE_SPELL,
                            BUTTON_ACTIONS.CREATE_SPELL
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.EDIT_MAGIC_NAME,
                            BUTTON_ACTIONS.EDIT_MAGIC_NAME
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.EDIT_MAGIC_COLOR,
                            BUTTON_ACTIONS.EDIT_MAGIC_COLOR
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
                                BUTTON_ACTIONS.EDIT_SPELL,
                                `EDIT_SPELL:${spell.id}`
                            ),
                        ],
                    ]),
                })
        );
    }

    @Hears(BUTTON_ACTIONS.EDIT_GRIMOIRE)
    async editGrimoire(@Ctx() ctx: BotContext) {
        ctx.reply('вы попали в меню редактирования гримуара', {
            ...Markup.keyboard([
                [
                    BUTTON_ACTIONS.CREATE_SPELL,
                    BUTTON_ACTIONS.EDIT_MAGIC_NAME,
                    BUTTON_ACTIONS.EDIT_MAGIC_COLOR,
                ],
                [BUTTON_ACTIONS.back],
            ]),
        });
    }
    @Action(BUTTON_ACTIONS.CREATE_SPELL)
    async createSpell(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.createSpell);
    }

    @Action(BUTTON_ACTIONS.EDIT_MAGIC_NAME)
    async editMagicName(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoireEditMagicName);
    }

    @Action(BUTTON_ACTIONS.EDIT_MAGIC_COLOR)
    async editMagicColor(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoireEditMagicColor);
    }
    @Hears(BUTTON_ACTIONS.back)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
}
