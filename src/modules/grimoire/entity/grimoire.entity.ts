import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { SpellEntity } from './spell.entity';
import { CharacterEntity } from '../../character/entity/character.entity';
import { Expose } from 'class-transformer';
import { ENUM_GRIMOIRE_STATUS } from '../constants/grimoire.enum.constant';
import { ManaZoneEntity } from './mana.zone.entity';

@Entity('grimoire')
export class GrimoireEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    magicName: string;

    @Column({
        type: 'enum',
        enum: ENUM_GRIMOIRE_STATUS,
        default: ENUM_GRIMOIRE_STATUS.NOT_APPROVED,
    })
    status: ENUM_GRIMOIRE_STATUS;

    @Column({
        type: 'varchar',
        nullable: true,
        name: 'cover_image_url',
    })
    coverImagePath: string;

    @Expose({ name: 'cover_image_url' })
    getAvatarImagePath(): string {
        return `${process.env.FILES_PATH}/images/grimoire/${this.coverImagePath}`;
    }
    @Column({
        type: 'varchar',
    })
    coverSymbol: string;

    @OneToMany(() => SpellEntity, (spell) => spell.grimoire)
    spells: Array<SpellEntity>;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;

    @Column({
        name: 'elemental_level',
        type: 'int',
        default: 1,
    })
    elementalLevel: number;

    @Column({
        name: 'reinforcement_level',
        type: 'int',
        default: 1,
    })
    reinforcementLevel: number;

    @Column({
        name: 'restraining_level',
        type: 'int',
        default: 1,
    })
    restrainingLevel: number;
    @Column({
        name: 'seal_level',
        type: 'int',
        default: 0,
    })
    sealLevel: number;

    @Column({
        name: 'healing_level',
        type: 'int',
        default: 0,
    })
    healingLevel: number;

    @Column({
        name: 'trap_level',
        type: 'int',
        default: 0,
    })
    trapLevel: number;

    @Column({
        name: 'forbidden',
        type: 'int',
        default: 0,
    })
    forbiddenLevel: number;
    @Column({
        name: 'curse_level',
        type: 'int',
        default: 0,
    })
    curseLevel: number;
    @OneToOne(() => ManaZoneEntity)
    @JoinColumn({
        name: 'mana_zone_id',
        referencedColumnName: 'id',
    })
    manaZone: ManaZoneEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}

/**
 *     @Expose({ name: 'cover_url' })
    getAvatarImagePath(): string {
        switch (process.env.disk) {
            case 'local':
                return `${process.env.FILES_PATH}/images/grimoire/${this.coverImagePath}`;
            case 's3':
                return `${process.env.AWS_BUCKET_URL}/grimoire/${this.coverImagePath}`;
            default:
                return null;
        }
    }
 */
/*
    @Column({
        type: 'enum',
        enum: ENUM_GRIMOIRE_SYMBOL,
        default: ENUM_GRIMOIRE_SYMBOL.CLOVER,
    })
    coverSymbol: ENUM_GRIMOIRE_SYMBOL;*/

/**
 *   @OneToOne(() => ManaSkinEntity)
    @JoinColumn({
        name: 'mana_skin_id',
        referencedColumnName: 'id',
    })
    manaSkin: ManaSkinEntity;
    @OneToOne(() => ManaZoneEntity)
    @JoinColumn({
        name: 'mana_zone',
        referencedColumnName: 'id',
    })
    manaZone: ManaZoneEntity;
 */
