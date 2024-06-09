import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyController } from './money.controller';
import { BankAccountEntity } from './entity/bank.account.entity';
import { BankEntity } from './entity/bank.entity';
import { CashEntity } from './entity/cash.entity';
import { WalletEntity } from './entity/wallet.entity';
import { InventoryEntity } from '../character/entity/inventory.entity';
import { WalletService } from './wallet.service';
import { MoneyLogEntity } from './entity/money.logs.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                InventoryEntity,
                BankAccountEntity,
                BankEntity,
                CashEntity,
                MoneyLogEntity,
                WalletEntity,
            ],
            process.env.DATABASE_NAME
        ),
    ],
    controllers: [MoneyController],
    providers: [WalletService],
    exports: [WalletService],
})
export class MoneyModule {}
