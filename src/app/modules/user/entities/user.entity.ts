import { RoleEntity } from 'src/app/modules/role/entities/role.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  //  role: RoleEntity;

    @Column({
        type: 'varchar',
    })
    tgUserId: string;
}
