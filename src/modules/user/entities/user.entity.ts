import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';
@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ENUM_ROLE_TYPE,
        default: ENUM_ROLE_TYPE.USER,
        nullable: false,
    })
    role: ENUM_ROLE_TYPE;

    @Column({
        type: 'varchar',
    })
    tgUserId: string;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'character_id',
        referencedColumnName: 'id',
    })
    character: CharacterEntity;
}
