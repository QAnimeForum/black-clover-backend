import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GrimoireEntity } from './grimoire.entity';

@Entity('mana_skin')
export class ManaSkinEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => GrimoireEntity)
    grimoire: GrimoireEntity;
}
