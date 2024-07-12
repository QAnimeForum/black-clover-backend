import { DatabaseBaseEntityAbstract } from 'src/common/database/abstracts/base/database.base-entity.abstract';
import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_DELETED_AT_FIELD_NAME,
    DATABASE_UPDATED_AT_FIELD_NAME,
} from 'src/common/database/constants/database.constant';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class DatabaseMongoUUIDEntityAbstract extends DatabaseBaseEntityAbstract {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column({
        type: 'timestamptz',
    })
    [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

    @Column({
        type: 'timestamptz',
    })
    [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

    @Column({
        type: 'timestamptz',
    })
    [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}
