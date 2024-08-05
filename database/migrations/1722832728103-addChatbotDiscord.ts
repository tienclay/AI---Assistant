import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatbotDiscord1722832728103 implements MigrationInterface {
    name = 'AddChatbotDiscord1722832728103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chatbot_discords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "discord_token" character varying, "public_key" character varying, "app_id" character varying, CONSTRAINT "PK_33fbcdb677a30cb8dd6cd8d8ac6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "chatbot_discords"`);
    }

}
