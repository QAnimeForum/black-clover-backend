import { Module } from '@nestjs/common';
import { GrimoireService } from './services/grimoire.service';
import { GrimoireController } from './controllers/grimoire.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrimoireEntity } from './entity/grimoire.entity';
import { SpellEntity } from './entity/spell.entity';
import { CharacterEntity } from '../characters/entity/character.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GrimoireEntity,
            SpellEntity,
            CharacterEntity,
        ]),
    ],
    controllers: [GrimoireController],
    providers: [GrimoireService],
})
export class GrimoireModule {}
