import { Scenes, Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { BotSession } from './bot.session';
import { BotWizardSession } from './bot.wizard.seesion';
import type { I18n } from 'telegraf-i18n';

export interface BotContext extends Context {
    myContextProp: string;
    i18n: I18n;
    session: BotSession;
    mediaGroup: Message[];
    scene: Scenes.SceneContextScene<BotContext, BotWizardSession>;
    wizard: Scenes.WizardContextWizard<BotContext>;
  //  i18n: I18n;
}
