import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SquadEntity } from './entity/squad.entity';
import { SquadsController } from './controllers/squads.controller';
import { SquadsService } from './service/squads.service';
import { RankEntity } from './entity/rank.entity';
import { SquadMemberEntity } from './entity/squad.member.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([SquadEntity, SquadMemberEntity, RankEntity]),
    ],
    controllers: [SquadsController],
    providers: [SquadsService],
})
export class SquadsModule {}
