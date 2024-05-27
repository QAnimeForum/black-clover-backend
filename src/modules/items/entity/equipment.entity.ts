import { ArmorEntity } from 'src/modules/items/entity/armor.entity';
import { BootsEntity } from 'src/modules/items/entity/boots.entity';
import { CloakEntity } from 'src/modules/items/entity/cloak.entity';
import { HelmetEntity } from 'src/modules/items/entity/helmet.entity';
import {
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('equipment')
export class EquipmentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    armor: ArmorEntity;

    boots: BootsEntity;

    cloak: CloakEntity;

    helmet: HelmetEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
