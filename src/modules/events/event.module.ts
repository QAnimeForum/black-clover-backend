import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './controllers/tasks.controller';
import { TaskEntity } from './entity/task.entity';
import { TasksService } from './services/tasks.service';
@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity])],
    controllers: [TaskController],
    providers: [TasksService],
})
export class EventsModule {}
