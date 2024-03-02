import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'magic_item',
})
export class MagicItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: false })
  name: string;

  @Column({ type: String, nullable: false })
  type: string;

  @Column({ type: String, nullable: false })
  rarity: number;

  @Column({ type: String, nullable: false })
  notes: string;

  @Column({ type: String, nullable: false })
  source: number;

  @Column({ type: String, nullable: false })
  value: string;

  @Column({ type: String, nullable: false })
  attunement: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
