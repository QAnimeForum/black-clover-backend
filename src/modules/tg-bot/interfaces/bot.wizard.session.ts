import { Scenes } from 'telegraf';
import { CharacterCreateDto } from '../../character/dto/character.create.dto';
import { SpellCreateDto } from '../../grimoire/dto/spell.create.dto';
import { GrimoireCreateDto } from '../../grimoire/dto/grimoire.create.dto';
import { SquadCreateDto } from 'src/modules/squards/dto/squad.create.dto';
import { MoneyAddDto } from 'src/modules/money/dto/money-add.dto';

export enum ENUM_DEVIL_LIST_BACK_TYPE {
    BACK_TO_HOME = 'BACK_TO_HOME',
    BACK_TO_SORT_TYPE = 'BACK_TO_SORT_TYPE',
    BACK_TO_RANK = 'BACK_TO_RANK',
    BACK_TO_FLOOR = 'BACK_TO_FLOOR',
}
export interface BotWizardSession extends Scenes.WizardSessionData {
    spell: SpellCreateDto;
    moneyInfo: MoneyAddDto;
    announcement: {
        name: string;
        description: string;
    };
    character: CharacterCreateDto;
    grimoire: GrimoireCreateDto;
    squad: SquadCreateDto;
    createdProblemId: string | null;
    devilsList: {
        backStatus: ENUM_DEVIL_LIST_BACK_TYPE;
        selectedId: string;
        /**
 *         type: string;
        devil_id: string;
 */
    };
}
