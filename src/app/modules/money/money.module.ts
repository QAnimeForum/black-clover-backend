import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { BankAccountEntity } from './entity/bank.account.entity';
import { BankEntity } from './entity/bank.entity';
import { CashEntity } from './entity/cash.entity';
import { WalletEntity } from './entity/wallet.entity';
import { MoneyLogEntity } from './entity/money.logs.enitiy';
import { InventoryEntity } from '../character/entity/inventory.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            InventoryEntity,
            BankAccountEntity,
            BankEntity,
            CashEntity,
            MoneyLogEntity,
            WalletEntity,
        ]),
    ],
    controllers: [MoneyController],
    providers: [MoneyService],
})
export class MoneyModule {}
