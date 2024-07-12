import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { GrimoireEntity } from './grimoire.entity';
import { GrimoireWorkerEntity } from './grimoire.worker.entity';

@Entity('grimoire_reservation')
export class GrimoireReservationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => GrimoireEntity)
    @JoinColumn({
        name: 'grimoire_id',
        referencedColumnName: 'id',
    })
    grimoire: GrimoireEntity;

    @Column({
        name: 'grimoire_id',
        type: 'uuid',
    })
    grimoireId: string;

    @ManyToOne(
        () => GrimoireWorkerEntity,
        (worker) => worker.gromoireReservations
    )
    @JoinColumn({
        name: 'worker_id',
        referencedColumnName: 'id',
    })
    grimoireWorker: GrimoireWorkerEntity;

    @Column({
        name: 'worker_id',
        type: 'uuid',
    })
    grimoireWorkerId: string;
}
