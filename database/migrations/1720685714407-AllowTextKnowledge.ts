import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowTextKnowledge1720685714407 implements MigrationInterface {
  name = 'AllowTextKnowledge1720685714407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledges" ALTER COLUMN "plain_text" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledges" ALTER COLUMN "plain_text" SET NOT NULL`,
    );
  }
}
