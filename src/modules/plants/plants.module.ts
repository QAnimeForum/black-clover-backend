import { Module } from '@nestjs/common';
import { GardenEntity } from './entity/garden.entity';
import { PlantEntity } from './entity/plant.entity';
import { PlantService } from './services/plant.service';
import { PotEntity } from './entity/pot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterModule } from '../character/character.module';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [GardenEntity, PlantEntity, PotEntity],
            process.env.DATABASE_NAME
        ),
        CharacterModule,
    ],
    providers: [PlantService],
    exports: [PlantService],
})
export class PlantsModule {}
