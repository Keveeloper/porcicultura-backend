import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVarchar1762997112091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(300)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(255)`);
    }

}
