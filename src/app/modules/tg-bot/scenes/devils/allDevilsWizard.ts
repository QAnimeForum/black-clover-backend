import { Context, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import {
    DEVIL_HOSTS_RULES,
    DEVILS_IMAGE_PATH,
    DEVILS_QLIPOTH_IMAGE_PATH,
    HELLO_IMAGE_PATH,
} from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { DevilFloorEnum } from 'src/app/modules/devils/constants/devil.floor.enum';
import { DevilRanksEnum } from 'src/app/modules/devils/constants/devil.ranks.enum';
import { DevilsService } from 'src/app/modules/devils/services/devils.service';
import { DevilEntity } from 'src/app/modules/devils/entity/devil.entity';

@Wizard(SceneIds.allDevils)
@UseFilters(TelegrafExceptionFilter)
export class AllDevilsWizard {
    constructor(
        private readonly devilService: DevilsService,
        private readonly tgBotService: TgBotService
    ) {}

    // STEP - 1 start travel
    @WizardStep(1)
    async step1(@Context() ctx: BotContext) {
        ctx.replyWithPhoto(
            { source: DEVILS_IMAGE_PATH },
            {
                caption: `Вы попали в преисподнюю`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Как заключить контракт с дьяволом',
                                url: DEVIL_HOSTS_RULES,
                            },
                        ],
                        [
                            {
                                text: 'Список всех дьяволов по рангу',
                                callback_data: 'rank',
                            },
                        ],
                        [
                            {
                                text: 'Список всех дьяволов по этажу',
                                callback_data: 'floor',
                            },
                        ],
                    ],
                },
            }
        );
        ctx.wizard.next();
    }

    // STEP - 2 Choose name

    @WizardStep(2)
    async step2(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query': {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    ctx.session.devils_list = ctx.callbackQuery.data;
                } else ctx.scene.leave();
                break;
            }
            case 'message': {
                ctx.scene.leave();
                break;
            }
            case 'inline_query': {
                ctx.scene.leave();
                break;
            }
        }
        ctx.replyWithPhoto(
            { source: DEVILS_QLIPOTH_IMAGE_PATH },
            {
                caption: `
      Список дьяволов по уровням
     `,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Высшие дьяволы',
                                callback_data: DevilRanksEnum.HIGHEST,
                            },
                        ],
                        [
                            {
                                text: 'Высокоранговые дьяволы',
                                callback_data: DevilRanksEnum.HIGH,
                            },
                        ],
                        [
                            {
                                text: 'Среднеранговые дьяволы',
                                callback_data: DevilRanksEnum.MID,
                            },
                        ],
                        [
                            {
                                text: 'Низкоранговые дьяволы',
                                callback_data: DevilRanksEnum.LOW,
                            },
                        ],
                        [{ text: 'Назад', callback_data: 'back' }],
                    ],
                },
            }
        );
        ctx.wizard.next();
    }

    @WizardStep(3)
    async step3(@Context() ctx: BotContext) {
        let devils: Array<DevilEntity> = [];
        console.log('hello');
        switch (ctx.updateType) {
            case 'callback_query':
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    devils = await this.devilService.findByRank(
                        DevilRanksEnum[ctx.callbackQuery.data]
                    );
                    console.log(devils);
                } else ctx.scene.leave();
            case 'message':
                ctx.scene.leave();
            case 'inline_query':
                ctx.scene.leave();
        }

        ctx.wizard.next();
    }

    @WizardStep(4)
    async step4(@Context() ctx: BotContext, @Message('text') msg: string) {
        ctx.scene.leave();
    }
}

/**
 * const {Telegraf, Scenes, session} = require('telegraf');
const {
  ALL_DEVILS_SCENE,
  PROFILE_SCENE,
 } = require('../constants/scenes_types');

 const devils = require("../../data/devils/highRnakingDevils.json").devils;
 const DevilRanks = {
  HighestRanking: "hightest",
  HighRanking: "high",
  MidRanking: "mid",
  LowRanking: "low"
};

const DevilFloors = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7
};


module.exports.allDevils = new Scenes.WizardScene(
  ALL_DEVILS_SCENE,
  async (ctx) => {
    ctx.wizard.state.devils_list = "";
    await ctx.replyWithPhoto(
     { source: process.env.DEVILS_IMAGE },
     {
       caption: `
       Вы попали в преисподнюю
      `,
       parse_mode: 'HTML',
       reply_markup: {
         inline_keyboard: [
            [ { text: "Как заключить контракт с дьяволом", url: process.env.DEVIL_HOSTS_RULES } ],
            [ { text: "Список всех дьяволов по рангу", callback_data: "rank" }],
            [ { text: "Список всех дьяволов по этажу", callback_data: "floor" }],
            ]
          }
     },
   )
   return ctx.wizard.next();
 },
 async (ctx) => {
 // await ctx.answerCbQuery();
 if(ctx.update.callback_query.message) {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
 }
  if(ctx.update.callback_query.data && 
   ( ctx.update.callback_query.data == "floor" ||
     ctx.update.callback_query.data == "rank")) {
      ctx.wizard.state.devils_list  = ctx.update.callback_query.data;
  }
  switch( ctx.wizard.state.devils_list) {
    case "floor": {
      ctx.replyWithPhoto(
        { source: process.env.DEVILS_QLIPOTH_IMAGE },
        {
          caption: `
          Список дьяволов по этажам
         `,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [ { text: "Первый этаж", callback_data: DevilFloors.one }],
              [ { text: "Второй этаж", callback_data: DevilFloors.two }],
              [ { text: "Третий этаж", callback_data: DevilFloors.three }],
              [ { text: "Четвёртый этаж", callback_data: DevilFloors.four }],
              [ { text: "Пятый этаж", callback_data: DevilFloors.five }],
              [ { text: "Шестой этаж", callback_data: DevilFloors.six }],
              [ { text: "Седьмой этаж", callback_data: DevilFloors.seven }],
              [ { text: "Назад", callback_data: "back" }],
               ]
             }
        },
      )
      break;
    }
    case "rank": {
      ctx.replyWithPhoto(
        { source: process.env.DEVILS_QLIPOTH_IMAGE },
        {
          caption: `
          Список дьяволов по уровням
         `,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
               [ { text: "Высшие дьяволы", callback_data: DevilRanks.HighestRanking }],
               [ { text: "Высокоранговые дьяволы", callback_data: DevilRanks.HighRanking }],
               [ { text: "Среднеранговые дьяволы", callback_data: DevilRanks.MidRanking }],
              [ { text: "Низкоранговые дьяволы", callback_data: DevilRanks.LowRanking }],
              [ { text: "Назад", callback_data: "back" }],
               ]
             }
        },
      )
      break;
    }
  }
     return ctx.wizard.next();
  //return ctx.scene.leave();
 },
 async (ctx) => {
  if(ctx.update.callback_query &&
    ctx.update.callback_query.data == "back") {
    if(ctx.update.callback_query.message) {
      ctx.deleteMessage(ctx.update.callback_query.message.message_id);
    }
    ctx.wizard.back(); 
     ctx.wizard.back(); 
    return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
  }
if(ctx.update.callback_query.message) {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
}
 if(ctx.update.callback_query.data != "back_list" &&
  (ctx.update.callback_query.data == DevilRanks.HighRanking ||
  ctx.update.callback_query.data == DevilRanks.MidRanking ||
  ctx.update.callback_query.data == DevilRanks.LowRanking ||
  ctx.update.callback_query.data == DevilFloors.one ||
  ctx.update.callback_query.data == DevilFloors.two ||
  ctx.update.callback_query.data == DevilFloors.three ||
  ctx.update.callback_query.data == DevilFloors.four ||
  ctx.update.callback_query.data == DevilFloors.five ||
  ctx.update.callback_query.data == DevilFloors.six
  )
  ) {
  await ctx.replyWithPhoto(
   { source: process.env.DEVILS_IMAGE },
   {
     caption: `
     Информация о дьяволах временно отсутствует
    `,
     parse_mode: 'HTML',
     reply_markup: {
       inline_keyboard: [
          [{text: "назад",  callback_data: "back_list"}]
          ]
        }
   },
 )
 return ctx.wizard.next();
} else {
  const devils_buttons = devils.map((item) => [ { text: `${item.name}`, callback_data: `${item.id}` }],);
  const buttons = devils_buttons.concat([ [{text: "назад",  callback_data: "back_list"}]]);
  await ctx.replyWithPhoto(
    { source: process.env.DEVILS_QLIPOTH_IMAGE },
   {
     caption: `
     Список высших дьяволов
    `,
     parse_mode: 'HTML',
     reply_markup: {
       inline_keyboard: buttons
   },
  }
 )
 return ctx.wizard.next();
}
},
async (ctx) => {
  if(
    ctx.update.callback_query && 
    ctx.update.callback_query.data == "back_list") {
    ctx.wizard.back();
    ctx.wizard.back();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
  }
  if(ctx.update.callback_query.message) {
    ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  }
  const devil = devils.filter(item => {
    return item.id == ctx.update.callback_query.data
  });
  if(devil.length == 0 && ctx.update.callback_query.data=="back1") {
    ctx.reply("Информация о дьяволе не найдена", {
      reply_markup: {
        inline_keyboard: [[{text: "назад",  callback_data: "back"}]]
         }
    })
  } else {
    const devil_info = devil[0];
    await ctx.replyWithPhoto(
     { source: process.env.LUCIFERO_IMAGE },
     {
       caption: `
Имя дьявола: ${devil_info.name}
Ранг: ${devil_info.rank}
Магический атрибут: ${devil_info.magic_attribute}
Бонусы при 10% единении
Бонусы при 25% единении
Бонусы при 50% единении
Бонусы при 65% единении
Бонусы при 80% единении
Бонусы при 100% единении
      `,
       parse_mode: 'HTML',
       reply_markup: {
         inline_keyboard: [
            [{text: "назад",  callback_data: "back1"}]
            ]
          }
     },
   )
  }
 return ctx.wizard.next();
},
async (ctx) => {
  if(ctx.update.callback_query.data == "back1") {
    ctx.wizard.back();
    ctx.wizard.back();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
  }
  return ctx.scene.leave();
},
);


 */
