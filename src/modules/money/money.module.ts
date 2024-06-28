import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyController } from './money.controller';
import { BankAccountEntity } from './entity/bank.account.entity';
import { BankEntity } from './entity/bank.entity';
import { WalletEntity } from './entity/wallet.entity';
import { WalletService } from './wallet.service';
import { MoneyLogEntity } from './entity/money.logs.entity';;
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
             //   InventoryEntity,
                BankAccountEntity,
                BankEntity,
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
