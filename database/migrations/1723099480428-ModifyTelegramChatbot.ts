import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTelegramChatbot1723099480428 implements MigrationInterface {
    name = 'ModifyTelegramChatbot1723099480428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "telegram_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "phone_number" character varying NOT NULL, "api_id" character varying NOT NULL, "api_hash" character varying NOT NULL, CONSTRAINT "PK_83d641faaacd9a0f9425f27b253" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "telegram_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "run_id" uuid NOT NULL, "telegram_chat_id" character varying NOT NULL, "telegram_user_id" character varying NOT NULL, "telegram_chatbot_id" uuid NOT NULL, CONSTRAINT "PK_3c3e0a559ab0c510b452344df57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" DROP COLUMN "telegram_bot_id"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" ADD "account_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" ADD "telegram_chatbot_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" ADD "token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" ADD CONSTRAINT "FK_5f03bbf755ac16377a37b55321f" FOREIGN KEY ("account_id") REFERENCES "telegram_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "telegram_participants" ADD CONSTRAINT "FK_b309914ad5875c578db15b6d5cd" FOREIGN KEY ("telegram_chatbot_id") REFERENCES "telegram_chatbots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telegram_participants" DROP CONSTRAINT "FK_b309914ad5875c578db15b6d5cd"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" DROP CONSTRAINT "FK_5f03bbf755ac16377a37b55321f"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" DROP COLUMN "telegram_chatbot_id"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" DROP COLUMN "account_id"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" ADD "telegram_bot_id" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "telegram_participants"`);
        await queryRunner.query(`DROP TABLE "telegram_accounts"`);
    }

}
