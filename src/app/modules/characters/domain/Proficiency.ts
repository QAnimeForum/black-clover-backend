export class Proficiency {
    level: number;
    extraBonus: number;
}

/**
 *  private _calculateLevelBonus: () => number = () =>
        // See https://roll20.net/compendium/dnd5e/Character%20Advancement#content
        Math.floor((this._level.totalLevel + 7) / 4);

    set extraBonus(value: number) {
        this._extraBonus = value;
    }

    get bonus(): number {
        return this._calculateLevelBonus() + this._extraBonus;
 */