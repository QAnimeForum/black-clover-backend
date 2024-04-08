import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MineralEntity } from './entities/mineral.entity';
import { MinesController } from './controllers/mines.controller';
import { MineService } from './services/mine.service';
import { MineEntity } from './entities/mine.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [MineralEntity, MineEntity],
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
