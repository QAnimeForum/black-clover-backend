import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrimoireEntity } from './entity/grimoire.entity';
import { SpellEntity } from './entity/spell.entity';
import { GrimoireService } from './services/grimoire.service';
import { GrimoireController } from './controllers/grimoire.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [GrimoireEntity, SpellEntity],
            process.env.DATABASE_NAME
        ),
    ],
    controllers: [GrimoireController],
    providers: [GrimoireService],
})
export class GrimoireModule {}
