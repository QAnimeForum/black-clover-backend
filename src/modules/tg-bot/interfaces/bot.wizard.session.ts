import { Scenes } from 'telegraf';
import { CharacterCreateDto } from '../../character/dto/character.create.dto';
import { SpellCreateDto } from '../../grimoire/dto/spell.create.dto';
import { GrimoireCreateDto } from '../../grimoire/dto/grimoire.create.dto';
import { SquadCreateDto } from 'src/modules/squards/dto/squad.create.dto';
import {
    MoneyAddDto,
    OfferAmmountDto,
} from 'src/modules/money/dto/money-add.dto';
import { PlantCreateDto } from 'src/modules/plants/services/plant.service';
import { EquipmentItemDto } from 'src/modules/items/dto/equipment.item.dto';
import { DevilCreateDto } from 'src/modules/devils/dtos/devil.create.dto';

export enum ENUM_DEVIL_LIST_BACK_TYPE {
    BACK_TO_HOME = 'BACK_TO_HOME',
    BACK_TO_SORT_TYPE = 'BACK_TO_SORT_TYPE',
    BACK_TO_RANK = 'BACK_TO_RANK',
    BACK_TO_FLOOR = 'BACK_TO_FLOOR',
    BACK_TO_DEVIL_LIST = 'BACK_TO_DEVIL_LIST',
}
export interface BotWizardSession extends Scenes.WizardSessionData {
    item: EquipmentItemDto;
    drink: {
        image: string;
        name: string;
        description: string;
    }
    itemIssued: {
        itemId: string;
        tgUserId: string;
    };
    spell: SpellCreateDto;
    offerAmount: OfferAmmountDto;
    moneyInfo: MoneyAddDto;
    announcement: {
        name: string;
        description: string;
    };
    character: CharacterCreateDto;
    grimoire: GrimoireCreateDto;
    squad: SquadCreateDto;
    plant: PlantCreateDto;
    createdProblemId: string | null;
    problemId: string;
    devilsList: {
        backStatus: ENUM_DEVIL_LIST_BACK_TYPE;
        sortType: 'rank' | 'floor';
        selectedId: string;
    };
    devil: DevilCreateDto;
}
