import { Controller, Get } from '@nestjs/common';

@Controller('grimoire')
export class GrimoireController {
    @Get()
    findAll(): string {
        return 'This action returns all character';
    }
}
