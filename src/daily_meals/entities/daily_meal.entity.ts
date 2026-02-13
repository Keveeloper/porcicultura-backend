import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique, UpdateDateColumn } from 'typeorm';
import { BatchStage } from 'src/batch_stages/entities/batch_stage.entity';

@Entity({ name: 'daily_meals' })
@Unique(['batchStage', 'date']) // Regla de oro: Un solo registro por día por etapa
export class DailyMeal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  feed_kg: number;

  @Column({ type: 'int', default: 0 })
  mortality: number;

  @Column({ type: 'text', nullable: true })
  observations: string;

  // Relación: Muchos registros de alimento diarios pertenecen a una etapa de lote
  @ManyToOne(() => BatchStage, (batchStage) => batchStage.dailyMeals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_stage_id' })
  batchStage: BatchStage;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
