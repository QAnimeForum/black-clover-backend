import { CardSymbolsEnum } from '../constants/card.symbol.enum';
import { Spell } from './Spell';

export class Grimoire {
    nameMagic: string;
    coversymbol: CardSymbolsEnum;
    magicColor: string;
    spells: Array<Spell>;
}

/**
 *    spellSlots: SpellSlot[];
    abilities: SpellcastingAbility[];}
 */
