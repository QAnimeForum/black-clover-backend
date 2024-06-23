import { Scenes } from 'telegraf';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BotWizardSession } from './bot.wizard.session';
import { DEVIL_DEFAULT_PER_PAGE } from 'src/modules/devils/constants/devil.list.constant';
import { PaginateQuery } from 'nestjs-paginate';

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
    devilsList: string;
    devilId: string;
    adminSelectedArmedForcesId: string;
    armedForcesId: string;
    grimoireId: string | null;
    spellId: string | null;
    problemId: string;
    user: UserEntity;
    devilPaginateQuery: PaginateQuery;
}
