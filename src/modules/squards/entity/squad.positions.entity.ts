import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SquadEntity } from './squad.entity';
import { SquadMemberEntity } from './squad.member.entity';

@Entity('squad_postitions')
export class SquadPositionsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => SquadEntity)
    @JoinColumn({
        name: 'squad_id',
        referencedColumnName: 'id',
    })
    squad: SquadEntity;

    @OneToOne(() => SquadMemberEntity)
    @JoinColumn({
        name: 'captain',
        referencedColumnName: 'id',
    })
    captain: SquadMemberEntity;

    @OneToOne(() => SquadMemberEntity)
    @JoinColumn({
        name: 'vice_captain',
        referencedColumnName: 'id',
    })
    viceCaptain: SquadMemberEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
