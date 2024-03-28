import { Type } from 'class-transformer';

import { StateEntity } from '../modules/map/enitity/state.entity';
export class AppCountriesSerialization {
    @Type(() => Array<StateEntity>)
    readonly countries: Array<StateEntity>;
}
