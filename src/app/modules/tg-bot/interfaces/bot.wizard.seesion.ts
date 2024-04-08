import { Scenes } from 'telegraf';
export interface BotWizardSession extends Scenes.WizardSessionData {
    categoriesMessageId: number;
}
