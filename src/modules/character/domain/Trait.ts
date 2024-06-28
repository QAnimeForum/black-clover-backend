export class ResourceTrait {
    resourceMax: number;
    proficiency: boolean;
}

export class ScalingTrait {
    bonus: number;
    dice: string;
    challengeRating: number;
    points: number;
    uses: number;
}

export class Trait {
    title: string;
    description: string;
    choices?: string[];
    resource?: ResourceTrait;
    scaling?: ScalingTrait;
    spellAdded?: string;
}
