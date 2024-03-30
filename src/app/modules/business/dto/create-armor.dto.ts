export class CreateArmorDto {
    id: string;

    name: string;

    armorType: string;

    cost: string;
    ac: {
        base: number;
        bonus: number;
    };

    strengthPrerequisite: number;

    stealthDisadvantage: boolean;

    weight: string;
}
