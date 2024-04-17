import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('spirit')
export class SpiritEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        name: 'image_path',
        type: 'varchar',
    })
    image: string;
}
