import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModelChatbotDiscord1722240633654 implements MigrationInterface {
  name = 'AddModelChatbotDiscord1722240633654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chatbot_discords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying, "created_by_id" uuid NOT NULL, "prompt" text, "instruction" character varying array, "persona" character varying array, "model" character varying NOT NULL DEFAULT 'gpt-4o-mini', "discord_token" character varying, "public_key" character varying, "app_id" character varying, CONSTRAINT "PK_33fbcdb677a30cb8dd6cd8d8ac6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_discords" ADD CONSTRAINT "FK_0d8d94ebcade8fad1447e79c27b" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chatbot_discords" DROP CONSTRAINT "FK_0d8d94ebcade8fad1447e79c27b"`,
    );
    await queryRunner.query(`DROP TABLE "chatbot_discords"`);
  }
}
