import {
    Context,
    Help,
    Start,
    Update,
    Command,
    InlineQuery,
    Ctx,
} from 'nestjs-telegraf';
import { Injectable } from '@nestjs/common';
import { BotContext } from '../interfaces/bot.context';
import { Markup, Telegraf } from 'telegraf';
import { SAMPLE_SPELL_URL } from '../constants/images';
import { ENUM_SCENES_ID } from '../constants/scenes.id.enum';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';
import { SEARCH_OFFERS_BY_NAME_BUTTON } from '../constants/button-names.constant';

@Injectable()
@Update()
//export class TgBotUpdate extends Telegraf<BotContext> {
export class TgBotUpdate extends Telegraf<BotContext> {
    @Start()
    async onStart(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID);
    }

    @Command('profile')
    async profile(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }

    @Command('grimoire')
    async grimoire(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_SCENE_ID);
    }
    @Command('map')
    async map(@Context() ctx: BotContext) {
        ctx.reply('карта пока недоступна');
        //   await ctx.scene.enter(ENUM_SCENES_ID.map);
    }

    @Command('spirits')
    async spitits(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ALL_SPIRITS_SCENE_ID);
    }
    @Command('underworld')
    async allDevils(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
    }

    @Command('profile')
    async spirits(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }

    @Command('equipment')
    async equipment(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.INVENTORY_SCENE_ID);
    }
    @Help()
    async helps(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HELP_SCENE_ID);
    }

    @Command('about')
    async about1(@Context() ctx: BotContext) {
        ctx.reply('Бот разрабатывался для аниме форума', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Ссылка на QFourum',
                            url: SAMPLE_SPELL_URL,
                        },
                    ],
                    [
                        {
                            text: 'Ссылка на правила',
                            url: SAMPLE_SPELL_URL,
                        },
                    ],
                ],
            },
        });
    }
    @InlineQuery('#wft')
    async searchByName(@Ctx() ctx: BotContext) {
        //    await ctx.scene.enter(ENUM_SCENES_ID.SEARCH_OFFERS_BY_NAME_SCENE_ID);
        console.log('djckdvjkf');
        const offers: Array<any> = [
            {
                id: 'kvfvkvf',
                item: {
                    name: 'fff',
                    description: 'vvvfrf',
                },
            },
        ];
        const result = offers.map(
            (offer): InlineQueryResult => ({
                type: 'article',
                id: offer.id,
                title: offer.item.name,
                description: offer.item.description,
                //   thumb_url: offer.item.url,
                input_message_content: {
                    message_text: offer.item.name,
                },
                ...Markup.inlineKeyboard([
                    Markup.button.callback(
                        SEARCH_OFFERS_BY_NAME_BUTTON,
                        SEARCH_OFFERS_BY_NAME_BUTTON
                    ),
                ]),
            })
        );
        await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);
        await ctx.answerInlineQuery(result);
    }
}

/**
     * 
     * @param ctx bot.command('create_spell', ctx => ctx.scene.enter(CREATE_SPELL_SCENE));
bot.command('profile', ctx => ctx.scene.enter(PROFILE_SCENE));
bot.command('map', ctx => ctx.scene.enter(MAP_SCENE));
bot.command('spells', ctx =>  ctx.reply("Список заклинаний"));
bot.command('underworld', ctx => ctx.scene.enter(ALL_DEVILS_SCENE));
bot.command('equipment', ctx =>  ctx.reply("Список обмундирования"));
bot.command('roll', ctx => ctx.scene.enter(ROLL_SCENE));
     */

/**
 * 
 * @param ctx     @Command('spirits')
    async allSpirits(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.allSpirits);
    }
 */
