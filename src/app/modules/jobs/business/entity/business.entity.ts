import { CharacterEntity } from '../../../character/entity/character.entity';
import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
    OneToOne,
    JoinColumn,
} from 'typeorm';
@Entity('uuid')
export class BusinessEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'int',
    })
    price: number;

    @Column({
        type: 'int',
    })
    income: number;

    @Column({
        type: 'int',
    })
    paid: number;
    @Column({
        type: 'date',
    })
    paymentTime: Date;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'owner_id',
        referencedColumnName: 'id',
    })
    owner: CharacterEntity;
}
