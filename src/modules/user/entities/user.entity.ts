import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';
@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'boolean',
        name: 'is_admin',
    })
    isAdmin: boolean;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    tgUserId: string;

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
