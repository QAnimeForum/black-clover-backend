import { Module } from '@nestjs/common';
import { DevilsController } from './controllers/devils.controller';
import { DevilsService } from './services/devils.service';
import { DevilEntity } from './entity/devil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevilUnionEntity } from './entity/devil.union.entity';
import { DevilSpellEntity } from './entity/devil.spell.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            DevilEntity,
            DevilUnionEntity,
            DevilSpellEntity,
        ]),
    ],
    controllers: [DevilsController],
    providers: [DevilsService],
    exports: [DevilsService],
})
export class DevilsModule {}
