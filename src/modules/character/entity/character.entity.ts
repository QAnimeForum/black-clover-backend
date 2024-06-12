import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BackgroundEntity } from './background.entity';
import { CharacterCharacteristicsEntity } from './character.characteristics.entity';
import { InventoryEntity } from './inventory.entity';
import { GrimoireEntity } from '../../grimoire/entity/grimoire.entity';
import { NoteEntity } from './note.entity';
import { WalletEntity } from '../../money/entity/wallet.entity';
import { FactionMemberEntity } from '../../judicial.system/entity/faction.member.entity';
import { SquadMemberEntity } from '../../squards/entity/squad.member.entity';
import { ENUM_CHARCACTER_TYPE } from '../constants/character.type.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { ArmedForcesRequestEntity } from '../../squards/entity/armed.forces.request.entity';
import { ProblemEntity } from '../../judicial.system/entity/problem.entity';
import { Expose } from 'class-transformer';
import { GardenEntity } from '../../plants/entity/garden.entity';
@Entity('character')
export class CharacterEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    avatar: string;

    @Expose({ name: 'avatar_url' })
    getAvatarImagePath(): string {
        switch (process.env.disk) {
            case 'local':
                return `${process.env.APP_API_URL}/avatar/${this.avatar}`;
            case 's3':
                return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
            default:
                return null;
        }
    }

    @Column({
        type: 'enum',
        enum: ENUM_CHARCACTER_TYPE,
        default: ENUM_CHARCACTER_TYPE.PC,
    })
    type: ENUM_CHARCACTER_TYPE;

    @Column({
        type: 'boolean',
    })
    prodigy: boolean;

    @OneToOne(() => BackgroundEntity)
    @JoinColumn({
        name: 'background_id',
        referencedColumnName: 'id',
    })
    background: BackgroundEntity;

    @Column({
        type: 'uuid',
        name: 'background_id',
    })
    backgroundId: string;

    @OneToOne(() => CharacterCharacteristicsEntity)
    @JoinColumn({
        name: 'characteristics_id',
        referencedColumnName: 'id',
    })
    characterCharacteristics: CharacterCharacteristicsEntity;

    @Column({
        type: 'uuid',
        name: 'characteristics_id',
    })
    characterCharacteristicsId: string;

    @OneToOne(() => GrimoireEntity, { nullable: true })
    @JoinColumn({
        name: 'grimoire_id',
        referencedColumnName: 'id',
    })
    grimoire: GrimoireEntity | null;

    @Column({
        type: 'uuid',
        name: 'grimoire_id',
        nullable: true,
    })
    grimoireId: string;

    @OneToMany(() => NoteEntity, (note) => note.character)
    notes: NoteEntity[];

    @OneToOne(() => InventoryEntity)
    @JoinColumn({
        name: 'inventory_id',
        referencedColumnName: 'id',
    })
    inventory: InventoryEntity;

    @Column({
        type: 'uuid',
        name: 'invenetory_id',
    })
    inventoryId: string;

    @OneToOne(() => WalletEntity)
    @JoinColumn({ name: 'character_id', referencedColumnName: 'id' })
    wallet: WalletEntity;

    @Column({
        type: 'uuid',
        name: 'wallet_id',
    })
    walletId: string;

    @OneToOne(() => FactionMemberEntity)
    factionMember: FactionMemberEntity;

    @OneToOne(() => SquadMemberEntity)
    squadMember: SquadMemberEntity;

    @OneToOne(() => UserEntity)
    user: UserEntity;

    @OneToOne(() => GardenEntity, (garden) => garden.id, { nullable: true })
    @JoinColumn({
        name: 'garden_id',
        referencedColumnName: 'id',
    })
    garden: GardenEntity | null;

    @Column({
        name: 'gargen_id',
        type: 'uuid',
        nullable: true,
    })
    gardenId: string;
    @OneToMany(
        () => ArmedForcesRequestEntity,
        (requests) => requests.armedForces
    )
    requests: Array<ArmedForcesRequestEntity>;

    @OneToMany(() => ProblemEntity, (problem) => problem.creator)
    problems: Array<ProblemEntity>;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
