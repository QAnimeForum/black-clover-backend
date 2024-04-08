import { Background } from './Background';
import { Inventory } from './Inventory';
import { CharacterCharacteristics } from './CharacterCharacteristics';
import { Note } from './Note';
import { ENUM_CHARCACTER_TYPE } from '../constants/character.type.enum';

export class Character {
    id: string;
    type: ENUM_CHARCACTER_TYPE;
    background: Background;
    characteristics: CharacterCharacteristics;
    // grimoire: Grimoire;
    notes: Note[];
    inventory: Inventory;
}
