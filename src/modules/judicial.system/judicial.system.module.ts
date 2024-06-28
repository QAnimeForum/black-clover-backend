import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WantedEntity } from './entity/wanted.entity';
import { FactionEntity } from './entity/faction.entity';
import { FactionMemberEntity } from './entity/faction.member.entity';
import { FactionRankEntity } from './entity/faction.rank.entity';
import { GangZoneEntity } from './entity/gang.zone.entity';
import { JudicialSystemController } from './controller/judicial.system.controller';
import { ArrestEntity } from './entity/arrest.entity';
import { ProblemJudgeInfoEntity } from './entity/problem-judge-info.entity';
import { ProblemEntity } from './entity/problem.entity';
import { SubmissionEntity } from './entity/submission.entity';
import { UserModule } from 'src/modules/user/user.module';
import { ProblemService } from './services/problem.service';
import { SubmissionService } from './services/submission.service';
import { CourtWorkerEntity } from './entity/court.worker.entity';
import { CourtWorkerService } from './services/court.worker.service';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([
            CourtWorkerEntity,
            ProblemJudgeInfoEntity,
            ProblemEntity,

            SubmissionEntity,
            ArrestEntity,
            FactionEntity,
            FactionMemberEntity,
            FactionRankEntity,
            GangZoneEntity,
            WantedEntity,
        ]),
    ],
    controllers: [JudicialSystemController],
    providers: [ProblemService, SubmissionService, CourtWorkerService],
    exports: [ProblemService, SubmissionService, CourtWorkerService],
})
export class JudicialSystemModule {}
