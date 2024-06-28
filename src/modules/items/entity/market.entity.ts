import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EquipmentEntity } from './equipment.entity';
import { CharacterEntity } from '../../character/entity/character.entity';
import { EqupmentItemEntity } from './equpment.item.entity';

@Entity('market')
export class MarketEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'owner_id',
        referencedColumnName: 'id',
    })
    owner: CharacterEntity;

    @Column({
        name: 'owner_id',
        type: 'uuid',
    })
    owner_id: string;

    @Column({
        name: 'price',
    })
    price: number;

    @OneToOne(() => EquipmentEntity)
    @JoinColumn({
        name: 'item_id',
        referencedColumnName: 'id',
    })
    item: EqupmentItemEntity;
    @Column({
        name: 'item_id',
        type: 'uuid',
    })
    item_id: string;
}
