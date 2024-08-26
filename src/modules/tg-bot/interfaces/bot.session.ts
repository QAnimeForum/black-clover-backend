import { Scenes } from 'telegraf';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BotWizardSession } from './bot.wizard.session';

import { PaginateQuery } from 'nestjs-paginate';
import { DevilUnionsPercentEnum } from 'src/modules/devils/constants/devil.union.percent.enum';

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
    devilsList: string;
    grimoireRequestId: string;
    devilId: string;
    adminSelectedArmedForcesId: string;
    adminSelectedMemberId: string;
    armedForcesId: string;
    problemId: string;
    itemId: string;
    user: UserEntity;
    devilPaginateQuery: PaginateQuery;
    adminGrimoireId: string | null;
    characterIdForChangeRaceAndState: string | null;
    adminSpellId: string | null;
    spellEdit: {
        grimoireId: string | null;
        spellId: string | null;
    };
    devilCreateSpellDto: {
        devilId: string;
        percent: DevilUnionsPercentEnum;
    };
    editUnionSpellId: string;
}
