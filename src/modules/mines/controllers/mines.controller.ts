import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { MineService } from '../services/mine.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/mines',
})
export class MinesController {
    constructor(private readonly mineService: MineService) {}
}
