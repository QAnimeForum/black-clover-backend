import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { WalletService } from './wallet.service';
@Controller({
    version: VERSION_NEUTRAL,
    path: '/money',
})
export class MoneyController {
    constructor(
        private readonly walletService: WalletService,
        private readonly paginationService: PaginationService
    ) {}
}
