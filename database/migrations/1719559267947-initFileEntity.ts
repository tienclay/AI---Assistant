import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitFileEntity1719559267947 implements MigrationInterface {
  name = 'InitFileEntity1719559267947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "key" character varying NOT NULL, "agent_id" uuid NOT NULL, CONSTRAINT "REL_13cf3b321e9fb42ea4c2cef6e9" UNIQUE ("agent_id"), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_13cf3b321e9fb42ea4c2cef6e9c" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_13cf3b321e9fb42ea4c2cef6e9c"`,
    );
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
