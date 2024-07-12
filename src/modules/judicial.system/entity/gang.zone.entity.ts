import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FactionEntity } from './faction.entity';

@Entity('gang_zone')
export class GangZoneEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => FactionEntity)
    @JoinColumn({
        name: 'faction_id',
        referencedColumnName: 'id',
    })
    owner: FactionEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
