import { Scenes } from 'telegraf';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BotWizardSession } from './bot.wizard.session';

import { PaginateQuery } from 'nestjs-paginate';
import { DevilUnionsPercentEnum } from 'src/modules/devils/constants/devil.union.percent.enum';
import { StateEntity } from 'src/modules/map/enitity/state.entity';
import { ProvinceEntity } from 'src/modules/map/enitity/province.entity';
import { BurgEntity } from 'src/modules/map/enitity/burg.entity';

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
    devilsList: string;
    grimoireRequestId: string;
    devilId: string;
    adminSelectedArmedForcesId: string;
    adminSelectedMemberId: string;
    armedForcesId: string;
    problemId: string;
    itemId: string;
    adminDrinkIdForEdit: string;
    user: UserEntity;
    devilPaginateQuery: PaginateQuery;
    selectedBarId: string;
    adminMenuId: string;
    adminSpellId: string | null;
    adminGrimoireId: string | null;
    characterIdForChangeRaceAndState: string | null;
    spellEdit: {
        grimoireId: string | null;
        spellId: string | null;
    };
    devilCreateSpellDto: {
        devilId: string;
        percent: DevilUnionsPercentEnum;
    };
    editUnionSpellId: string;
    map: {
        currentState: StateEntity;
        currentRegion: ProvinceEntity;
        currentCity: BurgEntity;
    };
}
