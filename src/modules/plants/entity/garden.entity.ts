import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PotEntity } from './pot.entity';
import { CharacterEntity } from '../../character/entity/character.entity';

@Entity('garden')
export class GardenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn({
        name: 'pot_1',
        referencedColumnName: 'id',
    })
    pot_1: PotEntity | null;

    @Column({
        name: 'pot_1',
        type: 'uuid',
    })
    pot_1_Id: string;
    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn({
        name: 'pot_2',
        referencedColumnName: 'id',
    })
    pot_2: PotEntity | null;

    @Column({
        name: 'pot_2',
        type: 'uuid',
    })
    pot_2_Id: string;
    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn({
        name: 'pot_3',
        referencedColumnName: 'id',
    })
    pot_3: PotEntity | null;

    @Column({
        name: 'pot_3',
        type: 'uuid',
    })
    pot_3_Id: string;

    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn({
        name: 'pot_4',
        referencedColumnName: 'id',
    })
    pot_4: PotEntity | null;

    @Column({
        name: 'pot_4',
        type: 'uuid',
    })
    pot_4_Id: string;

    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn({
        name: 'pot_5',
        referencedColumnName: 'id',
    })
    pot_5: PotEntity | null;

    @Column({
        name: 'pot_5',
        type: 'uuid',
    })
    pot_5_Id: string;

    @OneToOne(() => CharacterEntity, (character) => character.garden)
    character: CharacterEntity;
}
