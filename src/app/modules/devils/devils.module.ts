import { Module } from '@nestjs/common';
import { DevilsController } from './controllers/devils.controller';
import { DevilsService } from './services/devils.service';
import { DevilEntity } from './entity/devil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [TypeOrmModule.forFeature([DevilEntity])],
    controllers: [DevilsController],
    providers: [DevilsService],
})
export class DevilsModule {}
