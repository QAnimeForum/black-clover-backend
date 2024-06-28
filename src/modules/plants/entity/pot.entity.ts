import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { PlantEntity } from './plant.entity';

@Entity('pot')
export class PotEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', nullable: true })
    rentedUntil: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    liveUntil: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    nextWatering: Date | null;

    @Column({ default: 0 })
    stage: number;
    @ManyToOne(() => PlantEntity, {
        createForeignKeyConstraints: false,
        nullable: true,
    })
    @JoinColumn({
        name: 'plant_id',
        referencedColumnName: 'id',
    })
    plant: PlantEntity | null;

    @Column({
        name: 'plant_id',
        type: 'uuid',
        nullable: true,
    })
    plantId: string;
}

export type PotDict = { [key: number]: [number, number] };

export const potDict: PotDict = {
    1: [100, -1],
    2: [300, -1],
    3: [-1, 10],
    4: [-1, 10],
    5: [-1, 10],
};
