import { RaceEntity } from 'src/races/entity/race.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CharacterSex } from '../sex.enum';
import { CharacterEntity } from './character.entity';

@Entity({
  name: 'character_profile',
})
export class CharacterProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: false })
  user_id: number;

  @OneToOne(() => CharacterEntity, {
    eager: true,
  })
  user: CharacterEntity;

  @ManyToOne(() => RaceEntity, {
    eager: true,
  })
  race: RaceEntity;

  @Column({ type: String, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: CharacterSex,
    default: CharacterSex.MALE,
  })
  sex: CharacterSex;

  @Column({ type: String, nullable: false })
  gold: number;

  @Column({ type: String, nullable: false })
  isAlive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
