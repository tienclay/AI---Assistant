import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPromptAgent1719558076349 implements MigrationInterface {
  name = 'AddPromptAgent1719558076349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agents" ADD "prompt" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "prompt"`);
  }
}
