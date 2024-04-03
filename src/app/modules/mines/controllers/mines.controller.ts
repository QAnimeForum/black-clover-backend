import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { MineService } from '../services/mine.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/mines',
})
export class MinesController {
    constructor(
        private readonly mineService: MineService,
        private readonly paginationService: PaginationService
    ) {}
}
