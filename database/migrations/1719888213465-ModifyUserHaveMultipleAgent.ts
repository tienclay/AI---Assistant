import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUserHaveMultipleAgent1719888213465
  implements MigrationInterface
{
  name = 'ModifyUserHaveMultipleAgent1719888213465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agents" DROP CONSTRAINT "FK_57ee94c84a8e570e362af59dcea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" DROP CONSTRAINT "REL_57ee94c84a8e570e362af59dce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" ADD CONSTRAINT "FK_57ee94c84a8e570e362af59dcea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agents" DROP CONSTRAINT "FK_57ee94c84a8e570e362af59dcea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" ADD CONSTRAINT "REL_57ee94c84a8e570e362af59dce" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" ADD CONSTRAINT "FK_57ee94c84a8e570e362af59dcea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
