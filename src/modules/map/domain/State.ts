import { Burg } from './Burg';
import { Province } from './Province';
import { StateForm } from './StateForm';

export class State {
    id: number;
    name: number;
    fullName: string;
    form: StateForm;
    description: string;
    capital: Burg;
    provinces: Array<Province>;
}
