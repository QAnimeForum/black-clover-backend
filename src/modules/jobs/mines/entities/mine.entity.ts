import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MineralEntity } from './mineral.entity';
@Entity('mine')
export class MineEntity {
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

    /*@OneToMany(() => MineralEntity, (mineral) => mineral.mine)
    minerals: Array<MineralEntity>;*/
}
