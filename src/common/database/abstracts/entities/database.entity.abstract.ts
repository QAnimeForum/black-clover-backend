/**
 * mport { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_DELETED_AT_FIELD_NAME,
    DATABASE_UPDATED_AT_FIELD_NAME,
} from '../../database.constant';

@Entity()
export abstract class DatabaseEntityAbstract {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

    @Column()
    [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

    @Column()
    [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}

 */
