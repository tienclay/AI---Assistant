import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowNullTitleChatbot1720687113857 implements MigrationInterface {
  name = 'AllowNullTitleChatbot1720687113857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversations" ALTER COLUMN "title" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversations" ALTER COLUMN "title" SET NOT NULL`,
    );
  }
}
