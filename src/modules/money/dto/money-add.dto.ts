export class MoneyAddDto {
    adminId: number;
    tgId: number;
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
    description: string;
}

export class OfferAmmountDto {
    itemId: string;
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
}