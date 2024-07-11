import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixChatbot1720594741613 implements MigrationInterface {
  name = 'FixChatbot1720594741613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chatbots" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "chatbots" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbots" ALTER COLUMN "description" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chatbots" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "chatbots" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "chatbots" ADD "title" character varying NOT NULL`,
    );
  }
}
