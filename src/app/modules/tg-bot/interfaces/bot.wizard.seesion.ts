import { Scenes } from 'telegraf';
import { CharacterCreateDto } from '../../character/dto/character.create.dto';
export interface BotWizardSession extends Scenes.WizardSessionData {

    character: CharacterCreateDto;
}
