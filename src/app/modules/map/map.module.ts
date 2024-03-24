import { Module } from '@nestjs/common';
import { MapController } from './controllers/map.controller';
import { MapService } from './service/map.service';
import { BurgEntity } from './enitity/burg.entity';
import { ProvinceEnity } from './enitity/province.entity';
import { ProvinceFormEntity } from './enitity/province.form.entity';
import { StateEntity } from './enitity/state.entity';
import { StateFormEntity } from './enitity/state.form.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                BurgEntity,
                ProvinceEnity,
                ProvinceFormEntity,
                StateEntity,
                StateFormEntity,
            ],
            process.env.DATABASE_NAME
        ),
    ],
    providers: [MapService],
    exports: [MapService, TypeOrmModule],
    controllers: [MapController],
})
export class MapModule {}

/**
 *         TypeOrmModule.forRoot({
            // ... (previous TypeORM config)
            entities: [StateEntity],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([StateEntity]),
 */
