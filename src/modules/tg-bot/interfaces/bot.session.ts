import { Scenes } from 'telegraf';
import { BotWizardSession } from './bot.wizard.seesion';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
    devils_list: string;
    devil_id: string;
    armed_forces_id: string;
    user: UserEntity;
}
