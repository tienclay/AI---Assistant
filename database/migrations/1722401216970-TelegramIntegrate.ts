import { MigrationInterface, QueryRunner } from 'typeorm';

export class TelegramIntegrate1722401216970 implements MigrationInterface {
  name = 'TelegramIntegrate1722401216970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "telegram_chatbots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "chatbot_id" uuid NOT NULL, "telegram_bot_id" character varying NOT NULL, CONSTRAINT "PK_0168674f55de7e7a4e49d6c3dc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "telegram_partitipants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "run_id" character varying NOT NULL, "telegram_id" uuid NOT NULL, "telegram_user_id" character varying NOT NULL, CONSTRAINT "PK_536bd3862f71907bf56d702d5ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_chatbots" ADD CONSTRAINT "FK_b40f42450d67dc275f2f0a84131" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_partitipants" ADD CONSTRAINT "FK_c2642c86e20c4f475421218227b" FOREIGN KEY ("telegram_id") REFERENCES "telegram_chatbots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telegram_partitipants" DROP CONSTRAINT "FK_c2642c86e20c4f475421218227b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_chatbots" DROP CONSTRAINT "FK_b40f42450d67dc275f2f0a84131"`,
    );
    await queryRunner.query(`DROP TABLE "telegram_partitipants"`);
    await queryRunner.query(`DROP TABLE "telegram_chatbots"`);
  }
}
