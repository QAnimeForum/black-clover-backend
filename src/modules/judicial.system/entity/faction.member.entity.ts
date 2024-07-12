import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FactionRankEntity } from './faction.rank.entity';
import { CharacterEntity } from '../../character/entity/character.entity';
import { FactionEntity } from './faction.entity';

@Entity('faction_member')
export class FactionMemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'charachter_id',
        referencedColumnName: 'id',
    })
    character: CharacterEntity;

    @ManyToOne(() => FactionEntity, (faction) => faction.members)
    @JoinColumn({
        name: 'faction_id',
        referencedColumnName: 'id',
    })
    faction: FactionEntity;

    @ManyToOne(() => FactionRankEntity, (rank) => rank.members)
    @JoinColumn({
        name: 'rank_id',
        referencedColumnName: 'id',
    })
    rank: FactionRankEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
