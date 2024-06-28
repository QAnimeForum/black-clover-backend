import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { ProblemService } from '../services/problem.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/judicial_system',
})
export class JudicialSystemController {
    constructor(private readonly prombleSystemController: ProblemService) {}
}
