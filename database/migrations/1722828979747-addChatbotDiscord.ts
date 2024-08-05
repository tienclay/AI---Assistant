import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChatbotDiscord1722828979747 implements MigrationInterface {
  name = 'AddChatbotDiscord1722828979747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chatbot_discords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "discord_token" character varying, "public_key" character varying, "app_id" character varying, "chatbot_id" uuid, CONSTRAINT "PK_33fbcdb677a30cb8dd6cd8d8ac6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_discords" ADD CONSTRAINT "FK_58bd3eb1029c5ec731dc3095bea" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chatbot_discords" DROP CONSTRAINT "FK_58bd3eb1029c5ec731dc3095bea"`,
    );
    await queryRunner.query(`DROP TABLE "chatbot_discords"`);
  }
}
