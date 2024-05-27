import { Context, Help, Start, Update, Command } from 'nestjs-telegraf';
import { Injectable } from '@nestjs/common';
import { BotContext } from '../interfaces/bot.context';
import { Telegraf } from 'telegraf';
import { SAMPLE_SPELL_URL } from '../constants/images';
import { ENUM_SCENES_ID } from '../constants/scenes.id.enum';

@Injectable()
@Update()
//export class TgBotUpdate extends Telegraf<BotContext> {
export class TgBotUpdate extends Telegraf<BotContext> {
    @Start()
    async onStart(@Context() ctx: BotContext) {
        console.log('what');
        await ctx.scene.enter('START_SCENE_ID');
    }
    @Command('profile')
    async profile(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }

    @Command('map')
    async map(@Context() ctx: BotContext) {
        ctx.reply('карта пока недоступка');
        //   await ctx.scene.enter(ENUM_SCENES_ID.map);
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
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
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
