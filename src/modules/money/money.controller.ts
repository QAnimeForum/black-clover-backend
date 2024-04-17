import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { MoneyService } from './money.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/money',
})
export class MoneyController {
    constructor(
        private readonly moneyService: MoneyService,
        private readonly paginationService: PaginationService
    ) {}
}
