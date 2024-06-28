export class Armor {
    readonly name: string;
    readonly armorType: string;
    readonly cost: string;
    readonly AC: {
        base: number;
        modifier: number;
        bonus: number;
    };
    readonly strengthPrerequisite: number;
    readonly stealthDisadvantage: boolean;
    readonly weight: string;
    fightingStyles?: string[];
}
