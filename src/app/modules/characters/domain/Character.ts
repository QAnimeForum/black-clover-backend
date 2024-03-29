import { CharacterType } from '../constants/character.type.enum';
import { Background } from './Background';
import { Inventory } from './Inventory';
import { CharacterCharacteristics } from './CharacterCharacteristics';
import { Note } from './Note';

export class Character {
    id: string;
    type: CharacterType;
    background: Background;
    characteristics: CharacterCharacteristics;
   // grimoire: Grimoire;
    notes: Note[];
    inventory: Inventory;
}
