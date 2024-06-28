import { Armor } from './Armor';
import { Item } from './Item';
import { ToolKit } from './ToolKit';
import { Wallet } from './Wallet';
import { Weapon } from './Weapon';

export class Inventory {
    /**
     * оружие
     */
    weapons: Weapon[];
    /**
     * броня
     */
    armor: Armor[];
    /**инструмент */
    toolKits: ToolKit[];
    /**
     * механизм
     */
    gear: Item[];

    wallet: Wallet;
}
