import { StateFormEntity } from '../enitity/state.form.entity';

export class CreateStateDto {
    name: string;
    description: string;
    fullName: string;
    form: StateFormEntity;
    //form_id: string;
}
