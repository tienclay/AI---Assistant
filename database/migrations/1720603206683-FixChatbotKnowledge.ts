import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixChatbotKnowledge1720603206683 implements MigrationInterface {
  name = 'FixChatbotKnowledge1720603206683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "knowledges" DROP COLUMN "link_urls"`);
    await queryRunner.query(`ALTER TABLE "knowledges" DROP COLUMN "file_urls"`);
    await queryRunner.query(
      `ALTER TABLE "knowledges" ADD "website_urls" character varying array`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledges" ADD "pdf_urls" character varying array`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledges" DROP COLUMN "chatbot_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledges" ADD "chatbot_id" uuid NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledges" DROP COLUMN "chatbot_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledges" ADD "chatbot_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "knowledges" DROP COLUMN "pdf_urls"`);
    await queryRunner.query(
      `ALTER TABLE "knowledges" DROP COLUMN "website_urls"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledges" ADD "file_urls" uuid array`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledges" ADD "link_urls" uuid array`,
    );
  }
}
