import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WantedEntity } from './entity/wanted.entity';
import { FactionEntity } from './entity/faction.entity';
import { FactionMemberEntity } from './entity/faction.member.entity';
import { FactionRankEntity } from './entity/faction.rank.entity';
import { GangZoneEntity } from './entity/gang.zone.entity';
import { JudicialSystemController } from './controller/judicial.system.controller';
import { ArrestEntity } from './entity/arrest.entity';
import { ProblemFileEntity } from './entity/problem-file.entity';
import { ProblemJudgeInfoEntity } from './entity/problem-judge-info.entity';
import { ProblemTagEntity } from './entity/problem-tag.entity';
import { ProblemEntity } from './entity/problem.entity';
import { SubmissionDetailEntity } from './entity/submission-detail.entity';
import { SubmissionEntity } from './entity/submission.entity';
import { UserModule } from 'src/modules/user/user.module';
import { ProblemSystemService } from './services/problem.system.service';
@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([
            ProblemFileEntity,
            ProblemJudgeInfoEntity,
            ProblemTagEntity,
            ProblemEntity,
            SubmissionDetailEntity,
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
    providers: [ProblemSystemService],
    exports: [ProblemSystemService],
})
export class JudicialSystemModule {}
