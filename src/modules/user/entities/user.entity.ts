import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';

export enum ENUM_USER_PERMISSION_TYPE {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    OPRDINARY = 'OPRDINARY',
}

@Entity('game_user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        nullable: false,
        name: 'tg_user_id',
    })
    tgUserId: string;

    @OneToOne(() => CharacterEntity, (character) => character.user)
    character: CharacterEntity;

    @Column({
        type: 'enum',
        enum: ENUM_USER_PERMISSION_TYPE,
        default: ENUM_USER_PERMISSION_TYPE.OPRDINARY,
    })
    type: ENUM_USER_PERMISSION_TYPE;
}
