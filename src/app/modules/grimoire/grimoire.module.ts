import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrimoireEntity } from './entity/grimoire.entity';
import { SpellEntity } from './entity/spell.entity';
import { GrimoireService } from './services/grimoire.service';
import { GrimoireController } from './controllers/grimoire.controller';
import { CharacterEntity } from '../character/entity/character.entity';
import { UserEntity } from '../user/entities/user.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [GrimoireEntity, SpellEntity, UserEntity, CharacterEntity],
            process.env.DATABASE_NAME
        ),
    ],
    controllers: [GrimoireController],
    providers: [GrimoireService],
    exports: [GrimoireService],
})
export class GrimoireModule {}
