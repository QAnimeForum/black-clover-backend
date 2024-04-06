import { Controller, VERSION_NEUTRAL } from '@nestjs/common';

import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { SquadsService } from '../service/squads.service';
@Controller({
    version: VERSION_NEUTRAL,
    path: '/squads',
})
export class SquadsController {
    constructor(
        private readonly squadsService: SquadsService,
        private readonly paginationService: PaginationService
    ) {}
}
