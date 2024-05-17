import { Scenes } from 'telegraf';
import { CharacterCreateDto } from '../../character/dto/character.create.dto';
import { SpellCreateDto } from '../../grimoire/dto/spell.create.dto';
import { GrimoireCreateDto } from '../../grimoire/dto/grimoire.create.dto';
import { SquadCreateDto } from 'src/modules/jobs/squards/dto/squad.create.dto';

export enum ENUM_DEVIL_LIST_BACK_TYPE {
    BACK_TO_HOME = 'BACK_TO_HOME',
    BACK_TO_SORT_TYPE = 'BACK_TO_SORT_TYPE',
    BACK_TO_RANK = 'BACK_TO_RANK',
    BACK_TO_FLOOR = 'BACK_TO_FLOOR',
}
export interface BotWizardSession extends Scenes.WizardSessionData {
    spell: SpellCreateDto;
    character: CharacterCreateDto;
    grimoire: GrimoireCreateDto;
    squad: SquadCreateDto;
    devilsList: {
        backStatus: ENUM_DEVIL_LIST_BACK_TYPE;
        selectedId: string;
        /**
 *         type: string;
        devil_id: string;
 */
    };
}
