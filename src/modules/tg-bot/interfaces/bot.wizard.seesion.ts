import { Scenes } from 'telegraf';
import { CharacterCreateDto } from '../../character/dto/character.create.dto';
import { SpellCreateDto } from '../../grimoire/dto/spell.create.dto';
import { GrimoireCreateDto } from '../../grimoire/dto/grimoire.create.dto';
export interface BotWizardSession extends Scenes.WizardSessionData {
    spell: SpellCreateDto;
    character: CharacterCreateDto;
    grimoire: GrimoireCreateDto;
    devil_list: {
        type: string;
        devil_id: string;
    },
}
