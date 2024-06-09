import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';
@Entity('game_user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'boolean',
        name: 'is_admin',
    })
    isAdmin: boolean;

    @Column({
        type: 'int',
        nullable: false,
        name: 'tg_user_id',
    })
    tgUserId: number;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'character_id',
        referencedColumnName: 'id',
    })
    character: CharacterEntity;

    @Column({
        type: 'uuid',
        name: 'character_id',
        nullable: false,
    })
    characterId: string;
}
