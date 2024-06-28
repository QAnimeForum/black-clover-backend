import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GrimoireEntity } from './grimoire.entity';

@Entity('mana_zone')
export class ManaZoneEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'int',
    })
    level: number;

    @OneToOne(() => GrimoireEntity)
    grimoire: GrimoireEntity;
}
