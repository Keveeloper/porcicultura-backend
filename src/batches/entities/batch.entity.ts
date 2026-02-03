import { BatchStage } from "src/batch_stages/entities/batch_stage.entity";
import { Company } from "src/companies/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({name: 'batches'})
@Unique(['batch_number', 'company'])
export class Batch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 50})
    batch_number: string;

    // Relación ManyToOne: Muchos lotes pertenecen a una compañía
    @ManyToOne(() => Company, (company) => company.batches, { nullable: true })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    // Relación OneToMany: Un lote tiene muchas etapas
    @OneToMany(() => BatchStage, (batchStage) => batchStage.batch)
    stages: BatchStage[];

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}
