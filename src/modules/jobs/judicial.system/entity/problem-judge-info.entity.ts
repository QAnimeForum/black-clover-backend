import { Entity, PrimaryColumn, OneToOne, Column, JoinColumn } from 'typeorm';
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
}
