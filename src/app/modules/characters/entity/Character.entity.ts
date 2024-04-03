import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterType } from '../constants/character.type.enum';
import { BackgroundEnity } from './background.entity';
import { CharacterCharacteristicsEntity } from './character.characteristics.entity';
import { InventoryEntity } from './inventory.entity';
import { GrimoireEntity } from './grimoire.entity';
import { NoteEntity } from './note.entity';
import { WalletEntity } from '../../money/entity/wallet.entity';
import { VehicleEntity } from '../../business/entity/vehicle.entity';

@Entity('character')
export class CharacterEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: CharacterType,
        default: CharacterType.PC,
    })
    type: CharacterType;

    @OneToOne(() => BackgroundEnity)
    @JoinColumn({
        name: 'background_id',
    })
    background: BackgroundEnity;

    @OneToOne(() => CharacterCharacteristicsEntity)
    @JoinColumn({
        name: 'characteristics_id',
        referencedColumnName: 'id',
    })
    characterCharacteristics: CharacterCharacteristicsEntity;

    @OneToOne(() => GrimoireEntity)
    @JoinColumn({
        name: 'grimoire_id',
        referencedColumnName: 'id',
    })
    grimoire: GrimoireEntity;

    @OneToMany(() => NoteEntity, (note) => note.character)
    notes: NoteEntity[];

    @OneToOne(() => InventoryEntity)
    @JoinColumn({
        name: 'inventory_id',
        referencedColumnName: 'id',
    })
    inventory: InventoryEntity;

    @OneToOne(() => WalletEntity)
    @JoinColumn({ name: 'character_id', referencedColumnName: 'id' })
    wallet: WalletEntity;

    tasks: Array<TaskEntity>;
}

@Entity('task')
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}

@Entity('arrest')
export class ArrastEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'datetime',
    })
    time: Date;

    @Column({
        type: 'varchar',
    })
    reason: string;
}
