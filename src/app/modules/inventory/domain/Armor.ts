export interface Armor {
    readonly name: string;
    readonly armorType: string;
    readonly cost: string;
    readonly AC: {
        base: number;
        modifier: { value: number };
        bonus: { value: number };
    };
    readonly strengthPrerequisite: number;
    readonly stealthDisadvantage: boolean;
    readonly weight: string;
    fightingStyles?: string[];
}
