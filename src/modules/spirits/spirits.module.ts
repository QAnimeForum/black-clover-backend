import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpiritEntity } from './entity/spirit.entity';
import { SpiritService } from './service/spirit.service';
@Module({
    imports: [TypeOrmModule.forFeature([SpiritEntity])],
    providers: [SpiritService],
    exports: [SpiritService],
})
export class SpiritsModules {}
