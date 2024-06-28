import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './controllers/tasks.controller';
import { AnnouncementEntity } from './entity/announcement.entity';
import { AnnouncementService } from './services/announcement.service';
@Module({
    imports: [TypeOrmModule.forFeature([AnnouncementEntity])],
    controllers: [TaskController],
    providers: [AnnouncementService],
    exports: [AnnouncementService],
})
export class AnnouncementModule {}
