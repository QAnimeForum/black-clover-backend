import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from './entity/character.entity';
import { CharacterRepository } from './character.reposirory';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CharacterEntity])],
  providers: [CharacterRepository, CharacterService],
  controllers: [CharacterController],
})
export class CharacterModule {}
