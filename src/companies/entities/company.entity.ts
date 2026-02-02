import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Batch } from "src/batches/entities/batch.entity";

@Entity({ name: 'companies' })
export class Company {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
    nit: string;

    // Una compañía puede tener muchos usuarios
    @OneToMany(() => User, (user) => user.company)
    users: User[];

    // Una compañía puede tener muchos lotes
    @OneToMany(() => User, (user) => user.company)
    batches: Batch[];

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

}
