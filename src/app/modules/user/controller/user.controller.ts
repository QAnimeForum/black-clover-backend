import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { UserService } from '../service/user.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/user',
})
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly paginationService: PaginationService
    ) {}
}
