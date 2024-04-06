import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RankEntity } from './rank.entity';
import { CharacterEntity } from 'src/app/modules/character/entity/character.entity';
import { SquadEntity } from './squad.entity';

@Entity('squad_member')
export class SquadMemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    user: CharacterEntity;

    @ManyToOne(() => SquadEntity, (squad) => squad.members)
    @JoinColumn({
        name: 'faction_id',
        referencedColumnName: 'id',
    })
    squad: SquadEntity;

    @ManyToOne(() => RankEntity, (rank) => rank.members)
    @JoinColumn({
        name: 'rank_id',
        referencedColumnName: 'id',
    })
    rank: RankEntity;
}
