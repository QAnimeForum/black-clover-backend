import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BackgroundEnity } from './background.entity';
import { CharacterCharacteristicsEntity } from './character.characteristics.entity';
import { InventoryEntity } from './inventory.entity';
import { GrimoireEntity } from '../../grimoire/entity/grimoire.entity';
import { NoteEntity } from './note.entity';
import { WalletEntity } from '../../money/entity/wallet.entity';
import { TaskEntity } from '../../events/entity/task.entity';
import { BusinessEntity } from '../../jobs/business/entity/business.entity';
import { FactionMemberEntity } from '../../jobs/judicial.system/entity/faction.member.entity';
import { SquadMemberEntity } from '../../jobs/squards/entity/squad.member.entity';
import { ENUM_CHARCACTER_TYPE } from '../constants/character.type.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { ArmedForcesRequestEntity } from '../../jobs/squards/entity/armed.forces.request.entity';
@Entity('character')
export class CharacterEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ENUM_CHARCACTER_TYPE,
        default: ENUM_CHARCACTER_TYPE.PC,
    })
    type: ENUM_CHARCACTER_TYPE;

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

    @OneToOne(() => BusinessEntity)
    business: BusinessEntity;
    @OneToOne(() => FactionMemberEntity)
    factionMember: FactionMemberEntity;

    @OneToOne(() => SquadMemberEntity)
    squadMember: SquadMemberEntity;

    @ManyToMany(() => TaskEntity)
    @JoinTable()
    tasks: Array<TaskEntity>;

    @OneToOne(() => UserEntity)
    user: UserEntity;

    @OneToMany(
        () => ArmedForcesRequestEntity,
        (requests) => requests.armedForces
    )
    requests: Array<ArmedForcesRequestEntity>;
}
