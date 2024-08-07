import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ENUM_ARMED_FORCES_REQUEST } from '../constants/armed.forces.request.list';
import { ArmedForcesEntity } from './armed.forces.entity';
import { CharacterEntity } from '../../character/entity/character.entity';

@Entity('armed_forces_request')
export class ArmedForcesRequestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ArmedForcesEntity, (armedForces) => armedForces.requests)
    @JoinColumn({
        name: 'forces_id',
        referencedColumnName: 'id',
    })
    armedForces: ArmedForcesEntity;

    @Column({
        name: 'forces_id',
        type: 'uuid',
    })
    forcesId: string;

    @Column({
        type: 'varchar',
        name: 'tg_username',
    })
    tgUsername: string;

    @Column({
        type: 'varchar',
        name: 'tg_user_id',
    })
    tgUserId: string;

    @ManyToOne(() => CharacterEntity, (character) => character.requests)
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
    @Column({
        type: 'enum',
        enum: ENUM_ARMED_FORCES_REQUEST,
        default: ENUM_ARMED_FORCES_REQUEST.PENDING,
    })
    status: ENUM_ARMED_FORCES_REQUEST;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

}
