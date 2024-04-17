import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SquadEntity } from './entity/squad.entity';
import { SquadsController } from './controllers/squads.controller';
import { SquadsService } from './service/squads.service';
import { SquadMemberEntity } from './entity/squad.member.entity';
import { SquadRankEntity } from './entity/squad.rank.entity';
import { CharacterEntity } from '../../character/entity/character.entity';
import { ArmedForcesEntity } from './entity/armed.forces.entity';
import { SquadPositionsEntity } from './entity/squad.positions.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmedForcesEntity,
            SquadEntity,
            SquadMemberEntity,
            SquadRankEntity,
            CharacterEntity,
            SquadPositionsEntity,
        ]),
    ],
    controllers: [SquadsController],
    providers: [SquadsService],
})
export class SquadsModule {}
