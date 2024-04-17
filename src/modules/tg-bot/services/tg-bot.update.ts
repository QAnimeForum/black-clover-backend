import { Context, Help, Start, Update, Command } from 'nestjs-telegraf';
import { Injectable, Logger } from '@nestjs/common';
import { BotContext } from '../interfaces/bot.context';
import { SceneIds } from '../constants/scenes.id';
import { Telegraf } from 'telegraf';
import { SAMPLE_SPELL_URL } from '../constants/images';

@Injectable()
@Update()
export class TgBotUpdate extends Telegraf<BotContext> {
    private readonly logger = new Logger(TgBotUpdate.name);

    //constructor(private readonly tgBotService: TgBotService) {}

    @Start()
    async onStart(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.entry);
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

    @Command('profile')
    async profile(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }

    @Command('map')
    async map(@Context() ctx: BotContext) {
        ctx.reply('карта пока недоступка');
     //   await ctx.scene.enter(SceneIds.map);
    }

/**
 * 
 * @param ctx     @Command('spirits')
    async allSpirits(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allSpirits);
    }
 */

    @Command('underworld')
    async allDevils(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allDevils);
    }

    @Command('profile')
    async spirits(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }

    @Command('equipment')
    async equipment(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
    @Help()
    async helps(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.help);
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
