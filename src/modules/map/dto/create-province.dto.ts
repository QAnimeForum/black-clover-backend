import { ProvinceFormEntity } from '../enitity/province.form.entity';
import { StateEntity } from '../enitity/state.entity';

export class CreateProvinceDto {
    shortName: string;
    fullName: string;
    form: ProvinceFormEntity;
    state: StateEntity;
}
