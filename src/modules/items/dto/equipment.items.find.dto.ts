import { ENUM_BODY_PART_ENUM } from '../constants/body.part.enum';

export class EqupmentItemsFindDto {
    inventoryId: string;
    bodyPart: ENUM_BODY_PART_ENUM;
    page: number;
    limit: number;
}
