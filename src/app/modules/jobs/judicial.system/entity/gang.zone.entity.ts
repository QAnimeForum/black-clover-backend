import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
