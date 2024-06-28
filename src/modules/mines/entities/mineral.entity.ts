import {
    Column,
    CreateDateColumn,
    Entity,

    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('mineral')
export class MineralEntity {
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
        type: 'varchar',
    })
    image: string;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

   /* @ManyToOne(() => MineEntity)
    @JoinColumn({
        name: 'mine_id',
        referencedColumnName: 'id',
    })
    mine: MineEntity;*/
}
