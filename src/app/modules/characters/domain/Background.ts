import { State } from '../../map/domain/State';

export class Background {
    id: number;

    name: string;
    race: number;
    height: number;
    country: State;
    languages: string[];
    worldview: string;
    characterTraits: string[];
    ideals: string[];
    attachments: string[];
}
