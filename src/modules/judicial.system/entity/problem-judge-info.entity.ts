import { Entity, PrimaryColumn, OneToOne, Column, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProblemEntity } from './problem.entity';

@Entity('problem_judge_info')
export class ProblemJudgeInfoEntity {
    @OneToOne(() => ProblemEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    problem: Promise<ProblemEntity>;

    @PrimaryColumn()
    problemId: string;

    @Column({ type: 'json' })
    judgeInfo: unknown;

    @Column({ type: 'boolean', default: true })
    submittable: boolean;


    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

}
