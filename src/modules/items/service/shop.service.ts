import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { InventoryService } from './inventory.service';
import { Inject, Injectable } from '@nestjs/common';
import { WalletService } from 'src/modules/money/wallet.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { ShopEntity } from '../entity/shop.entity';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { MoneyDto } from 'src/modules/money/dto/money.dto';
import { categories } from 'Assets/json/items/categories.json';
import { ItemCategoryEntity } from '../entity/item.category.entity';
@Injectable()
export class ShopService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(ShopEntity)
        private readonly shopRepository: Repository<ShopEntity>,
        @InjectRepository(EqupmentItemEntity)
        private readonly equipmentItemRepository: Repository<EqupmentItemEntity>,
        @InjectRepository(ItemCategoryEntity)
        private readonly categoriesRepository: Repository<ItemCategoryEntity>,
        @Inject(InventoryService)
        private readonly inventoryService: InventoryService,
        @Inject(WalletService)
        private readonly walletService: WalletService
    ) {}

    async createCategories() {
        for (let i = 0; i < categories.length; ++i) {
            const item = categories[i];
            const category = new ItemCategoryEntity();
            category.name = item.name;
            category.description = '';
            const parent = await this.categoriesRepository.save(category);
            await this.saveChildren(item.children, parent);
        }
    }
    async saveChildren(array: Array<any>, parent: ItemCategoryEntity) {
        for (let i = 0; i < array.length; ++i) {
            const item = array[i];
            const category = new ItemCategoryEntity();
            category.name = item.name;
            category.description = '';
            category.parent = parent;
            const newParent = await this.categoriesRepository.save(category);
            await this.saveChildren(item.children, newParent);
        }
    }
    createOffer(dto: CreateOfferDto) {
        const newOffer = new ShopEntity();
        newOffer.itemId = dto.itemId;
        newOffer.copper = dto.copper;
        newOffer.silver = dto.silver;
        newOffer.gold = dto.gold;
        newOffer.electrum = dto.electrum;
        newOffer.platinum = dto.platinum;
        newOffer.isActive = true;
        return this.shopRepository.save(newOffer);
    }

    async checkMoneyPrice(
        transaction: EntityManager,
        offerId: string
    ): Promise<MoneyDto> {
        const shop = await transaction.findOne(ShopEntity, {
            where: {
                id: offerId,
            },
        });
        if (shop) {
            return {
                copper: shop.copper,
                silver: shop.silver,
                gold: shop.gold,
                electrum: shop.electrum,
                platinum: shop.platinum,
            };
        } else {
            throw Error('Нет предложения с данным id.');
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
            return result[0].isActive;
        } else {
            throw Error('No offer with such id');
        }
    }

    async makeOfferNotActive(offerId: string): Promise<void> {
        const result: ShopEntity[] = await this.shopRepository.findBy({
            id: offerId,
        });
        if (result.length) {
            this.shopRepository.update(offerId, { isActive: false });
        } else {
            throw Error('No offer with such id');
        }
    }

    async buy(offerId: string, buyerTgId: string) {
        let caption =
            'Вы не смогли купить предмет. Обратитись к администраторам для помощи.';
        await this.connection.transaction(
            'READ UNCOMMITTED',
            async (transactionManager) => {
                const offerStatus = await this.checkOfferActive(offerId);
                if (!offerStatus) {
                    return offerStatus;
                }
                const price = await this.checkMoneyPrice(
                    transactionManager,
                    offerId
                );
                const wallet =
                    await this.walletService.findWalletByUserTgIdWithTransaction(
                        transactionManager,
                        buyerTgId
                    );
                const inventoryId =
                    await this.inventoryService.findInventoryIdByTgId(
                        buyerTgId
                    );

                const offer = await transactionManager.findOne(ShopEntity, {
                    where: {
                        id: offerId,
                    },
                    relations: {
                        item: true,
                    },
                });

                caption = `Вы купили предмет ${offer.item.name} за \n`;
                caption += `${price.copper} 🟤`;
                caption += `${price.silver} ⚪️`;
                caption += `${price.electrum} 🔵`;
                caption += `${price.gold} 🟡`;
                caption += `${price.platinum} 🪙\n`;
                caption += `На счету было:\n`;
                caption += `${wallet.copper} 🟤`;
                caption += `${wallet.silver} ⚪️`;
                caption += `${wallet.electrum} 🔵`;
                caption += `${wallet.gold} 🟡`;
                caption += `${wallet.platinum} 🪙\n`;
                if (this.walletService.canUserBuyItem(wallet, price)) {
                    const offer = await this.findOfferById(offerId);
                    const inentoryItem =
                        await this.inventoryService.addItemToInventory(
                            transactionManager,
                            inventoryId,
                            offer.itemId
                        );
                    await this.walletService.payWithMoney(
                        transactionManager,
                        wallet,
                        price
                    );
                }
                const newWallet =
                    await this.walletService.findWalletByUserTgIdWithTransaction(
                        transactionManager,
                        buyerTgId
                    );
                caption += `На счету стало:\n`;
                caption += `${newWallet.copper} 🟤`;
                caption += `${newWallet.silver} ⚪️`;
                caption += `${newWallet.electrum} 🔵`;
                caption += `${newWallet.gold} 🟡`;
                caption += `${newWallet.platinum} 🪙\n`;
            }
        );
        return caption;
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
    async findOfferById(offerId: string) {
        return await this.shopRepository.findOneBy({
            id: offerId,
        });
    }
}

export class CreateOfferDto {
    itemId: string;
    copper: number;
    silver: number;
    gold: number;
    electrum: number;
    platinum: number;
}
