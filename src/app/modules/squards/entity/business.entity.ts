import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { CharacterEntity } from '../../characters/entity/character.entity';

@Entity('uuid')
export class Business {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'string',
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
    paymentTime?: Date;

    owner: CharacterEntity;
}
