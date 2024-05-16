import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('problem_tag')
export class ProblemTagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20 })
    name: string;

    @Column({ type: 'varchar', length: 20 })
    color: string;
}
