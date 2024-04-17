import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entity/wallet.entity';
import { BankAccountEntity } from './entity/bank.account.entity';
import { BankEntity } from './entity/bank.entity';
import { CashEntity } from './entity/cash.entity';
import { MoneyLogEntity } from './entity/money.logs.enitiy';
@Injectable()
export class MoneyService {
    constructor(
        @InjectRepository(BankAccountEntity)
        private readonly bankAccountRepository: Repository<BankAccountEntity>,
        @InjectRepository(BankEntity)
        private readonly bankRepository: Repository<BankEntity>,
        @InjectRepository(CashEntity)
        private readonly cashRepository: Repository<CashEntity>,
        @InjectRepository(MoneyLogEntity)
        private readonly moneyLogRepository: Repository<MoneyLogEntity>,
        @InjectRepository(WalletEntity)
        private readonly walletRepository: Repository<WalletEntity>
    ) {}
}
