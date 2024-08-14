import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTelegramEntity1723618347535 implements MigrationInterface {
    name = 'ModifyTelegramEntity1723618347535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telegram_accounts" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" ADD "string_session" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."telegram_chatbots_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" ADD "status" "public"."telegram_chatbots_status_enum" NOT NULL DEFAULT 'INACTIVE'`);
        await queryRunner.query(`ALTER TABLE "telegram_accounts" ADD CONSTRAINT "UQ_d53f4c5ea6c81a77fe43d845480" UNIQUE ("phone_number")`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" ADD CONSTRAINT "UQ_10621e5792671329fc7e175c836" UNIQUE ("telegram_chatbot_id")`);
        await queryRunner.query(`ALTER TABLE "telegram_accounts" ADD CONSTRAINT "UQ_dc566ee7f37a7bfbebde9435716" UNIQUE ("api_id", "api_hash")`);
        await queryRunner.query(`ALTER TABLE "telegram_accounts" ADD CONSTRAINT "FK_de1e5eae4be1f14ff6d36d3e097" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telegram_accounts" DROP CONSTRAINT "FK_de1e5eae4be1f14ff6d36d3e097"`);
        await queryRunner.query(`ALTER TABLE "telegram_accounts" DROP CONSTRAINT "UQ_dc566ee7f37a7bfbebde9435716"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" DROP CONSTRAINT "UQ_10621e5792671329fc7e175c836"`);
        await queryRunner.query(`ALTER TABLE "telegram_accounts" DROP CONSTRAINT "UQ_d53f4c5ea6c81a77fe43d845480"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."telegram_chatbots_status_enum"`);
        await queryRunner.query(`ALTER TABLE "telegram_chatbots" DROP COLUMN "string_session"`);
        await queryRunner.query(`ALTER TABLE "telegram_accounts" DROP COLUMN "user_id"`);
    }

}
