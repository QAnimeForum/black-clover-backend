import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('background')
export class BackgroundEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
