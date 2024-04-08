import { RoleEntity } from 'src/app/modules/role/entities/role.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    role: RoleEntity;

    @Column({
        type: 'varchar',
    })
    firstName: string;

    @Column({
        type: 'varchar',
    })
    lastName: string;

    @Column({
        type: 'varchar',
    })
    username: string;

    @Column({
        type: 'varchar',
    })
    tgUserId: string;
}
