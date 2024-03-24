import { Module } from '@nestjs/common';
import { GrimoireService } from './services/grimoire';
import { GrimoireController } from './controllers/grimoire.controller';

@Module({
    controllers: [GrimoireController],
    providers: [GrimoireService],
})
export class GrimoireModule {}
