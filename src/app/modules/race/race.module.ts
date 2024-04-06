import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceController } from './race.controller';
import { RaceService } from './race.service';
import { RaceEntity } from './entity/race.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([RaceEntity], process.env.DATABASE_NAME),
    ],
    controllers: [RaceController],
    providers: [RaceService],
})
export class RaceModule {}
