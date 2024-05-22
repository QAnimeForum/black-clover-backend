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
import { ENUM_IS_GRIMOIRE_APPROVED } from '../constants/grimoire.enum.constant';
import { Expose } from 'class-transformer';

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
        enum: ENUM_IS_GRIMOIRE_APPROVED,
        default: ENUM_IS_GRIMOIRE_APPROVED.NOT_APPROVED,
    })
    status: ENUM_IS_GRIMOIRE_APPROVED;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    cover: string;

    @Expose({ name: 'cover_url' })
    getAvatarImagePath(): string {
        switch (process.env.disk) {
            case 'local':
                return `${process.env.APP_API_URL}/grimoire/${this.cover}`;
            case 's3':
                return `${process.env.AWS_BUCKET_URL}/grimoire/${this.cover}`;
            default:
                return null;
        }
    }
    /*
    @Column({
        type: 'enum',
        enum: ENUM_GRIMOIRE_SYMBOL,
        default: ENUM_GRIMOIRE_SYMBOL.CLOVER,
    })
    coverSymbol: ENUM_GRIMOIRE_SYMBOL;*/

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
