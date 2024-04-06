import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { JudicialSystemService } from '../services/judicial.system.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/judicial_system',
})
export class JudicialSystemController {
    constructor(
        private readonly judicialSystemService: JudicialSystemService,
        private readonly paginationService: PaginationService
    ) {}
}
