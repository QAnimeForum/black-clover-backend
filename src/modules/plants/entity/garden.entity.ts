import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PotEntity } from './pot.entity';

@Entity('garden')
export class GardenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn()
    pot_1: PotEntity | null;

    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn()
    pot_2: PotEntity | null;

    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn()
    pot_3: PotEntity | null;

    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn()
    pot_4: PotEntity | null;

    @OneToOne(() => PotEntity, { nullable: true })
    @JoinColumn()
    pot_5: PotEntity | null;
}
