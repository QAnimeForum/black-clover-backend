import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { InventoryService } from './inventory.service';
import { Inject, Injectable } from '@nestjs/common';
import { WalletService } from 'src/modules/money/wallet.service';
import { UserService } from 'src/modules/user/services/user.service';
import { DataSource, Repository } from 'typeorm';
import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { MarketEntity } from '../entity/market.entity';
import { ShopEntity } from '../entity/shop.entity';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ShopService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(ShopEntity)
        private readonly shopRepository: Repository<ShopEntity>,
        @InjectRepository(EqupmentItemEntity)
        private readonly equipmentItemRepository: Repository<EqupmentItemEntity>,
        @Inject(InventoryService)
        private readonly inventoryService: InventoryService,
        @Inject(WalletService)
        private readonly walletService: WalletService
    ) {}
 
    create(itemId: string, price: number) {
        const newOffer = new ShopEntity();
        newOffer.itemId = itemId;
        newOffer.price = price;
        newOffer.isActvie = true;
        return this.shopRepository.save(newOffer);
    }

    async checkMoneyPrice(offerId: string): Promise<number> {
        const result: ShopEntity[] = await this.shopRepository.findBy({
            id: offerId,
        });
        if (result.length) {
            return result[0].price;
        } else {
            throw Error('No offer with such id');
        }
    }

    async hasItemOffer(itemId: string): Promise<boolean> {
        const shopEntity = await this.shopRepository.findOneBy({
            itemId: itemId,
        });
        return shopEntity !== null;
    }

    async checkOfferActive(offerId: string): Promise<boolean> {
        const result: ShopEntity[] = await this.shopRepository.findBy({
            id: offerId,
        });
        if (result.length) {
            return result[0].isActvie;
        } else {
            throw Error('No offer with such id');
        }
    }

    async makeOfferNotActive(offerId: string): Promise<void> {
        const result: ShopEntity[] = await this.shopRepository.findBy({
            id: offerId,
        });
        if (result.length) {
            this.shopRepository.update(offerId, { isActvie: false });
        } else {
            throw Error('No offer with such id');
        }
    }
    /*
    async buyOfferWithMoney(
        offerId: string,
        buyerId: number
    ): Promise<boolean> {
        const offerStatus = await this.checkOfferActive(offerId);
        if (!offerStatus) {
            return offerStatus;
        }
        const price = await this.checkMoneyPrice(offerId);
        if ((await UserService.checkMoneyBalance(buyer_id)) - price >= 0) {
            InventoryService.create(buyer_id, await this.getItemId(offerId));
            UserService.payWithMoney(buyer_id, price);
            return new Promise((resolve) => {
                resolve(true);
            });
        }
        return new Promise((resolve) => {
            resolve(false);
        });
    }*/
    async findAllOffers(query: PaginateQuery) {
        return paginate(query, this.shopRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['id'],
            select: [
                'id',
                'is_active',
                'item',
                'item.name',
                'item.image',
                'item.bodyPart',
                'item.description',
            ],
            defaultLimit: 5,
            filterableColumns: {
                id: [FilterOperator.EQ],
                isActive: [FilterOperator.EQ],
            },
            relations: ['item'],
        });
        // return await this.shopRepository.findBy({ isActvie: true });
    }
}
