import { CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GrimoireEntity } from './grimoire.entity';

@Entity('mana_skin')
export class ManaSkinEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => GrimoireEntity)
    grimoire: GrimoireEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

}
