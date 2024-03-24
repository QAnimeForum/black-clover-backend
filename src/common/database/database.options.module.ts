import { Module } from '@nestjs/common';
import { DatabaseOptionsService } from './database.config.service';
@Module({
    providers: [DatabaseOptionsService],
    exports: [DatabaseOptionsService],
    imports: [],
    controllers: [],
})
export class DatabaseOptionsModule {}
