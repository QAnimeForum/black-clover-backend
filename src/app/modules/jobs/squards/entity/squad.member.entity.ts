import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../../character/entity/character.entity';
import { SquadEntity } from './squad.entity';
import { SquadRankEntity } from './squad.rank.entity';

@Entity('squad_member')
export class SquadMemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'character_id',
        referencedColumnName: 'id',
    })
    character: CharacterEntity;

    @ManyToOne(() => SquadEntity, (squad) => squad.members)
    @JoinColumn({
        name: 'squad_id',
        referencedColumnName: 'id',
    })
    squad: SquadEntity;

    @ManyToOne(() => SquadRankEntity, (rank) => rank.members)
    @JoinColumn({
        name: 'rank_id',
        referencedColumnName: 'id',
    })
    rank: SquadRankEntity;
}
