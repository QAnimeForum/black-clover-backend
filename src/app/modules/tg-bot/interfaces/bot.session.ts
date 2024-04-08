import { Scenes } from 'telegraf';
import { BotWizardSession } from './bot.wizard.seesion';

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
    phoneNumber: string;
    fullName: string;
}
