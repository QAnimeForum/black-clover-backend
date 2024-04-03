import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { BankAccountEntity } from './entity/bank.account.enity';
import { BankEntity } from './entity/bank.enity';
import { CashEntity } from './entity/cash.entity';
import { WalletEntity } from './entity/wallet.entity';
import { MoneyLogEntity } from './entity/money.logs.enitiy';
@Module({
    imports: [
        TypeOrmModule.forFeature([
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
