import { Scenes, Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { BotSession } from './bot.session';
import { BotWizardSession } from './bot.wizard.session';
export interface BotContext extends Context {
    session: BotSession;
    mediaGroup: Message[];
    scene: Scenes.SceneContextScene<BotContext, BotWizardSession>;
    wizard: Scenes.WizardContextWizard<BotContext>;
  //  i18n: I18n;
}
