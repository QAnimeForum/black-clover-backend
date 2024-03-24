import { Controller, Get } from '@nestjs/common';

@Controller('inventory')
export class InventoryController {
    @Get()
    findAll(): string {
        return 'This action returns all character';
    }
}
