import { Company } from "src/companies/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({name: 'batches'})
@Unique(['batch_number', 'company'])
export class Batch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 50})
    batch_number: string; //Número o código del lote

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'initial_total_weight' })
    initialTotalWeight: number; // Peso total inicial (570,04)

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'initial_pig_weight' })
    initialPigWeight: number; // Peso lechón (6,48)

    // Estos campos se llenarán al finalizar el ciclo o etapa
    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'final_batch_weight', nullable: true })
    finalBatchWeight: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'final_pig_weight', nullable: true })
    finalPigWeight: number; //Peso final lechón

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'weight_gain', nullable: true })
    weightGain: number; //Ganancia de peso

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'conversion_rate', nullable: true })
    conversionRate: number; //Tasa de conversión

    // Relación ManyToOne: Muchos lotes pertenecen a una compañía
    @ManyToOne(() => Company, (company) => company.batches, { nullable: true })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}