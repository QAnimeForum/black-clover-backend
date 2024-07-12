import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SquadEntity } from './entity/squad.entity';
import { SquadsController } from './controllers/squads.controller';
import { SquadsService } from './service/squads.service';
import { SquadMemberEntity } from './entity/squad.member.entity';
import { CharacterEntity } from '../character/entity/character.entity';
import { ArmedForcesEntity } from './entity/armed.forces.entity';
import { SquadPositionsEntity } from './entity/squad.positions.entity';
import { ArmedForcesRequestEntity } from './entity/armed.forces.request.entity';
import { CharacterModule } from 'src/modules/character/character.module';
import { ArmedForcesRankEntity } from './entity/armed.forces.rank.entity';
import { ArmedForcesMemberEntity } from './entity/armed.forces.member.entity';
import { ArmedForcesJobPermissionEntity } from './entity/armed.forces.permission.entity';
import { ArmedForcesJobTitleEntity } from './entity/armed.forces.job.title.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmedForcesMemberEntity,
            ArmedForcesJobTitleEntity,
            ArmedForcesJobPermissionEntity,
            ArmedForcesRequestEntity,
            ArmedForcesEntity,
            SquadEntity,
            SquadMemberEntity,
            ArmedForcesRankEntity,
            CharacterEntity,
            SquadPositionsEntity,
        ]),
        CharacterModule,
    ],
    controllers: [SquadsController],

    exports: [SquadsService],
    providers: [SquadsService],
})
export class SquadsModule {}
