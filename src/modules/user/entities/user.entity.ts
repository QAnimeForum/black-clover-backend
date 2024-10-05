import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
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

    /* 
     @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;*/
}
