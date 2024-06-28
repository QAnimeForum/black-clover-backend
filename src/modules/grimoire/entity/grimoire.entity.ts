import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SpellEntity } from './spell.entity';
import { CharacterEntity } from '../../character/entity/character.entity';
import { Expose } from 'class-transformer';
import { ENUM_GRIMOIRE_STATUS } from '../constants/grimoire.enum.constant';

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
