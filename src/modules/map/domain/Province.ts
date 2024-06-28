import { Burg } from './Burg';
import { ProvinceForm } from './ProvinceForm';

export class Province {
    id: number;
    form: ProvinceForm;
    shortName: string;
    fullName: string;

    burgs: Array<Burg>;
}
