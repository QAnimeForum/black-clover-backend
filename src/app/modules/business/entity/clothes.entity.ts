import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clothes')
export class ClothesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    gender: string;
    @Column({
        type: 'varchar',
    })
    category: string;
    @Column({
        type: 'int',
    })
    style: number;
    @Column({
        type: 'int',
    })
    price: number;
}
