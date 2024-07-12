import { State } from '../../map/domain/State';
import { Race } from './Race';
export class Background {
    id: number;

    name: string;
    race: Race;
    height: number;
    country: State;
}

/**
 *  features: Trait[];
    languages: string[];
    worldview: string;
    characterTraits: string[];
    ideals: string[];
    attachments: string[];
 */
