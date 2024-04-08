import { StateFormEntity } from '../enitity/state.form.entity';

export class CreateStateDto {
    name: string;
    description: string;
    fullName: string;
    form: StateFormEntity;
    coverSymbol: string;
    //form_id: string;
}
