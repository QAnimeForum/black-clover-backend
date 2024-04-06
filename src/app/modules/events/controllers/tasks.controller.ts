import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { TasksService } from '../services/tasks.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/task',
})
export class TaskController {
    constructor(
        private readonly eventsService: TasksService,
        private readonly paginationService: PaginationService
    ) {}
}
