import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('armed_forces_permission')
export class ArmedForcesJobPermissionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'name',
        type: 'varchar',
    })
    name: string;

    @Column({
        name: 'leader',
        type: 'varchar',
    })
    leader: boolean;
    @Column({
        name: 'captain',
        type: 'varchar',
    })
    captain: boolean;
    @Column({
        name: 'viceCapitan',
        type: 'varchar',
    })
    viceCapitan: boolean;
    @Column({
        name: 'member',
        type: 'varchar',
    })
    member: boolean;
    @Column({
        name: 'warehouse',
        type: 'varchar',
    })
    warehouse: boolean;
    @Column({
        name: 'inventory',
        type: 'varchar',
    })
    inventory: boolean;
    @Column({
        name: 'garage',
        type: 'varchar',
    })
    garage: boolean;
    @Column({
        name: 'workshop',
        type: 'varchar',
    })
    workshop: boolean;
}
