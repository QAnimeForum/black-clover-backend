import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { ProblemSystemService } from '../services/problem.system.service';
@Controller({
    version: VERSION_NEUTRAL,
    path: '/judicial_system',
})
export class JudicialSystemController {
    constructor(
        private readonly prombleSystemController: ProblemSystemService
    ) {}
}
