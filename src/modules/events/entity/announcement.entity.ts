import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ENUM_ANNOUNCEMENT_TYPE } from '../constant/announcement.enum';

@Entity('announcement')
export class AnnouncementEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    title: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        type: 'enum',
        enum: ENUM_ANNOUNCEMENT_TYPE,
        default: ENUM_ANNOUNCEMENT_TYPE.DRAFT,
    })
    type: ENUM_ANNOUNCEMENT_TYPE;
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
