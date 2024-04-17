import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WantedEntity } from './entity/wanted.entity';
import { FactionEntity } from './entity/faction.entity';
import { FactionMemberEntity } from './entity/faction.member.entity';
import { FactionRankEntity } from './entity/faction.rank.entity';
import { GangZoneEntity } from './entity/gang.zone.entity';
import { JudicialSystemController } from './controller/judicial.system.controller';
import { JudicialSystemService } from './services/judicial.system.service';
import { ArrestEntity } from './entity/arrest.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArrestEntity,
            FactionEntity,
            FactionMemberEntity,
            FactionRankEntity,
            GangZoneEntity,
            WantedEntity,
        ]),
    ],
    controllers: [JudicialSystemController],
    providers: [JudicialSystemService],
})
export class JudicialSystemModule {}
