import { tr } from '@faker-js/faker';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('grimoire_request')
export class GrimoireRequestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'magic_name',
    })
    magicName: string;

    @Column({
        type: 'varchar',
        name: 'tg_username',
    })
    tgUsername: string;

    @Column({
        type: 'varchar',
        name: 'tg_user_id',
        unique: true
    })
    tgUserId: string;
}
