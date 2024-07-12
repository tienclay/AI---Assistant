import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyInstructionAndPersonaToString1720781269217
  implements MigrationInterface
{
  name = 'ModifyInstructionAndPersonaToString1720781269217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chatbots" DROP COLUMN "instruction"`);
    await queryRunner.query(
      `ALTER TABLE "chatbots" ADD "instruction" character varying array`,
    );
    await queryRunner.query(`ALTER TABLE "chatbots" DROP COLUMN "persona"`);
    await queryRunner.query(
      `ALTER TABLE "chatbots" ADD "persona" character varying array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chatbots" DROP COLUMN "persona"`);
    await queryRunner.query(`ALTER TABLE "chatbots" ADD "persona" text`);
    await queryRunner.query(`ALTER TABLE "chatbots" DROP COLUMN "instruction"`);
    await queryRunner.query(`ALTER TABLE "chatbots" ADD "instruction" text`);
  }
}
