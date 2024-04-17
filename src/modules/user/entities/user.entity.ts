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
