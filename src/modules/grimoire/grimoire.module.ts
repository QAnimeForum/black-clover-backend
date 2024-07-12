import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrimoireEntity } from './entity/grimoire.entity';
import { SpellEntity } from './entity/spell.entity';
import { GrimoireService } from './services/grimoire.service';
import { GrimoireController } from './controllers/grimoire.controller';
import { CharacterEntity } from '../character/entity/character.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ManaSkinEntity } from './entity/mana.skin.entity';
import { ManaZoneEntity } from './entity/mana.zone.entity';
import { SpellRequirementsEntity } from './entity/spell.requirements.entity';
import { GrimoireWorkerEntity } from './entity/grimoire.worker.entity';
import { GrmoireWorkerService } from './services/grimoire.worker.service';
import { GrimoireRequestEntity } from './entity/grimoire.request.entity';
import { GrimoireReservationEntity } from './entity/grimoire.reservation.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                GrimoireWorkerEntity,
                GrimoireRequestEntity,
                GrimoireEntity,
                SpellEntity,
                SpellRequirementsEntity,
                UserEntity,
                CharacterEntity,
                ManaSkinEntity,
                ManaZoneEntity,
                GrimoireReservationEntity,
            ],
            process.env.DATABASE_NAME
        ),
    ],
    controllers: [GrimoireController],
    providers: [GrimoireService, GrmoireWorkerService],
    exports: [GrimoireService, GrmoireWorkerService],
})
export class GrimoireModule {}
