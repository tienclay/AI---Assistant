import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingChatbotProperty1720596256670 implements MigrationInterface {
  name = 'AddingChatbotProperty1720596256670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chatbots" ADD "persona" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chatbots" DROP COLUMN "persona"`);
  }
}
