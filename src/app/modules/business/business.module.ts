import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessController } from './business.controller';
import { ArmorEntity } from './entity/armor.entity';
import { WeaponEntity } from './entity/weapon.entity';
import { BusinessService } from './business.service';
import { ArmorClassEntity } from '../characters/entity/character.characteristics.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([ArmorEntity, ArmorClassEntity, WeaponEntity]),
    ],
    controllers: [BusinessController],
    providers: [BusinessService],
})
export class BuisnessModule {}
