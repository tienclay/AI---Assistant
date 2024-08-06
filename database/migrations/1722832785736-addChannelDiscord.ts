import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChannelDiscord1722832785736 implements MigrationInterface {
  name = 'AddChannelDiscord1722832785736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "channels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "chatbot_id" character varying NOT NULL, "conversation_id" uuid NOT NULL, "channel_id" character varying NOT NULL, CONSTRAINT "PK_bc603823f3f741359c2339389f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "channels" ADD CONSTRAINT "FK_38d1b262fb38d7af317b7d4beee" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channels" DROP CONSTRAINT "FK_38d1b262fb38d7af317b7d4beee"`,
    );
    await queryRunner.query(`DROP TABLE "channels"`);
  }
}
