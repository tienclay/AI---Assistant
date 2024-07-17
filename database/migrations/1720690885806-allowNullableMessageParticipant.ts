import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowNullableMessageParticipant1720690885806
  implements MigrationInterface
{
  name = 'AllowNullableMessageParticipant1720690885806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_28e6c9707905ad29dcc7c5fb5f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ALTER COLUMN "participant_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_28e6c9707905ad29dcc7c5fb5f1" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_28e6c9707905ad29dcc7c5fb5f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ALTER COLUMN "participant_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_28e6c9707905ad29dcc7c5fb5f1" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
