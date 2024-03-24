import { Module } from '@nestjs/common';
import { InventoryService } from './service/inventory.service';
@Module({
    controllers: [],
    providers: [InventoryService],
})
export class InventoryModule {}
