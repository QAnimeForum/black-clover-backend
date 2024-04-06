import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MineralEnity } from './entities/mineral.entity';
import { MinesController } from './controllers/mines.controller';
import { MineService } from './services/mine.service';
import { MineEntity } from './entities/mine.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [MineralEnity, MineEntity],
            process.env.DATABASE_NAME
        ),
    ],
    providers: [MineService],
    controllers: [MinesController],
})
export class MinesModule {}

/**
 *         TypeOrmModule.forRoot({
            // ... (previous TypeORM config)
            entities: [StateEntity],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([StateEntity]),
 */
