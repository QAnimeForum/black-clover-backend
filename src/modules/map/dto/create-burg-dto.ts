import { ProvinceEntity } from '../enitity/province.entity';

export class CreateBurgDto {
    name: string;
    description: string;
    province: ProvinceEntity;
}
