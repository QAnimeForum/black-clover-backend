import { Scenes } from 'telegraf';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BotWizardSession } from './bot.wizard.session';

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
    devils_list: string;
    devil_id: string;
    armed_forces_id: string;
    user: UserEntity;
}
