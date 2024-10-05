import {
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('drink')
export class RecipeEntity {
    @PrimaryColumn('uuid')
    id: string;
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
