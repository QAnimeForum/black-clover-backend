import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { MarketEntity } from '../entity/market.entity';
import { InventoryService } from './inventory.service';
import { WalletService } from 'src/modules/money/wallet.service';
import { CharacterService } from 'src/modules/character/services/character.service';
@Injectable()
export class MarketService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(MarketEntity)
        private readonly marketRepository: Repository<MarketEntity>,
        @InjectRepository(EqupmentItemEntity)
        private readonly equipmentItemRepository: Repository<EqupmentItemEntity>,
        @Inject(InventoryService)
        private readonly inventoryService: InventoryService,
        @Inject(WalletService)
        private readonly walletService: WalletService
    ) {}

    async createOffer(
        ownerId: string,
        price: number,
        itemId: string,
        inventoryId: string
    ): Promise<void> {
        const new_offer = new MarketEntity();
        new_offer.owner_id = ownerId;
        new_offer.price = price;
        new_offer.item_id = itemId;
        //  await this.equipmentItemRepository.delete(inventoryId);
        this.marketRepository.save(new_offer);
    }

    async retriveItem(offerId: string): Promise<boolean> {
        const offer = await this.marketRepository.findBy({ id: offerId });
        if (offer.length === 0) {
            return new Promise((resolve) => {
                resolve(false);
            });
        }
      /*  this.inventoryService.addItemToInventory(
            offer[0].owner_id,
            offer[0].item_id
        );*/
        await this.marketRepository.delete(offerId);
        return new Promise((resolve) => {
            resolve(true);
        });
    }

    async delete(offerId: string): Promise<boolean> {
        const offer = await this.marketRepository.findBy({ id: offerId });
        if (offer.length === 0) {
            return new Promise((resolve) => {
                resolve(false);
            });
        }
        await this.marketRepository.delete(offerId);
        return new Promise((resolve) => {
            resolve(true);
        });
    }

    async checkPrice(offerId: string): Promise<number> {
        const res = await this.marketRepository.findBy({ id: offerId });
        if (res.length > 0) {
            return res[0].price;
        }
        throw Error('No offer with such id');
    }

    async checkOwner(offerId: string): Promise<string> {
        const res = await this.marketRepository.findBy({ id: offerId });
        if (res.length > 0) {
            return res[0].owner_id;
        }
        throw Error('No offer with such id');
    }

    async getItemId(offerId: string): Promise<string> {
        const res = await this.marketRepository.findBy({ id: offerId });
        if (res.length > 0) {
            return res[0].id;
        }
        throw Error('No offer with such id');
    }

    async buyOffer(buyerTgId: string, offerId: string): Promise<boolean> {
        return false;
        /*   if ((await this.marketRepository.countBy({ id: offerId })) === 0) {
            return new Promise((resolve) => {
                resolve(false);
            });
        }
        const price = await this.checkPrice(offerId);
        if (
            (await this.walletService.checkMoneyBalance(buyerTgId)) - price >=
            0
        ) {
            this.inventoryService.addItemToInventory(
                buyerTgId,
                await this.getItemId(offerId)
            );
            this.walletService.payWithMoney(buyerTgId, price);
               this.walletService.getMoney(await this.checkOwner(offerId), price);
            await this.delete(offerId);
            return new Promise((resolve) => {
                resolve(true);
            });
        }
        return new Promise((resolve) => {
            resolve(false);
        });*/
    }

    async checkUsersOffers(tguserId: string): Promise<MarketEntity[]> {
        return await this.connection.query(
            `select market.* from market JOIN character ON wallet.owner = character.id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tguserId}'`
        );
    }

    async getIdWithName(itemName: string) {
        const res: EqupmentItemEntity[] =
            await this.equipmentItemRepository.findBy({
                name: itemName,
            });
        if (res.length) {
            return res[0].id;
        } else {
            return null;
        }
    }
    findEquipmentItemById(id: string): Promise<EqupmentItemEntity | null> {
        return this.equipmentItemRepository.findOneBy({ id });
    }

    findEquipmentItemByName(name: string): Promise<EqupmentItemEntity | null> {
        return this.equipmentItemRepository.findOneBy({ name });
    }

    async findOffersWithItem(itemName: string): Promise<MarketEntity[]> {
        const itemId = await this.getIdWithName(itemName);
        if (itemId === null) {
            return [];
        }
        return await this.marketRepository.findBy({ item_id: itemId });
    }

    public findAllClothes(
        query: PaginateQuery
    ): Promise<Paginated<EqupmentItemEntity>> {
        return paginate(query, this.equipmentItemRepository, {
            sortableColumns: ['id', 'category'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['category'],
            select: ['id', 'name'],
            filterableColumns: {
                category: [FilterOperator.EQ],
            },
        });
    }

    async deleteClothes(id: string): Promise<void> {
        await this.equipmentItemRepository.delete(id);
    }
}
