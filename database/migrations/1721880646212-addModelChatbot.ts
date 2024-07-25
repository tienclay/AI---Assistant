import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModelChatbot1721880646212 implements MigrationInterface {
  name = 'AddModelChatbot1721880646212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chatbots" ADD "model" character varying NOT NULL DEFAULT 'gpt-4o-mini'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chatbots" DROP COLUMN "model"`);
  }
}
