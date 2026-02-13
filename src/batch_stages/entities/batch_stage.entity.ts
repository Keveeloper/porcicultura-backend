import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BatchStageType } from "./types";
import { BatchStageStatus } from "./types";
import { Batch } from "src/batches/entities/batch.entity";
import { DailyMeal } from "src/daily_meals/entities/daily_meal.entity";

@Entity({name: 'batch_stages'})
export class BatchStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'enum', enum: BatchStageType, default: BatchStageType.PRE_NURSERY})
  stage_type: BatchStageType;

  @Column({type: 'date'})
  start_date: Date;

  @Column({type: 'date', nullable: true})
  end_date: Date | null;

  @Column({ type: 'int' })
  number_of_weeks: number;

  @Column({ type: 'int' })
  initial_pigs: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  initial_batch_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  final_batch_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  initial_pig_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  final_pig_weight: number;

  @Column({type: 'enum', enum: BatchStageStatus, default: BatchStageStatus.PENDING})
  status: BatchStageStatus;

  @ManyToOne(() => Batch, (batch) => batch.stages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @OneToMany(() => DailyMeal, (dailyMeal) => dailyMeal.batchStage)
  dailyMeals: DailyMeal[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
