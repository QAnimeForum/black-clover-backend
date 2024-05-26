import { Scenes } from 'telegraf';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BotWizardSession } from './bot.wizard.session';

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
    devilsList: string;
    devilId: string;
    armedForcesId: string;
    user: UserEntity;
}
