import { CharacterEntity } from '../../character/entity/character.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { GrimoireReservationEntity } from './grimoire.reservation.entity';

@Entity('grimoire_worker')
export class GrimoireWorkerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'character_id',
        referencedColumnName: 'id',
    })
    character: CharacterEntity;
    @Column({
        name: 'character_id',
        type: 'uuid',
    })
    characterId: string;

    @OneToMany(
        () => GrimoireReservationEntity,
        (reservation) => reservation.grimoireWorker
    )
    gromoireReservations: GrimoireReservationEntity[];
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
