import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('beverage_container')
export class BeverageContainersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        type: 'uuid',
        name: 'type_id',
    })
    typeId: string;

    
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
