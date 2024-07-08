import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1720170366583 implements MigrationInterface {
  name = 'UpdateSchema1720170366583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chatbots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "description" character varying NOT NULL, "created_by_id" uuid NOT NULL, CONSTRAINT "PK_ec8923205b2059dbc8dfb6ef8e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_1cda06c31eec1c95b3365a0283f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."messages_message_sender_enum" AS ENUM('BOT', 'AGENT', 'USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "message_sender" "public"."messages_message_sender_enum" NOT NULL, "participant_id" uuid NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "chatbot_id" uuid NOT NULL, "title" character varying NOT NULL, "participant_id" character varying NOT NULL, "last_message_id" uuid, CONSTRAINT "REL_a53679287450d522a3f700088e" UNIQUE ("last_message_id"), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "knowledges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plain_text" character varying NOT NULL, "link_ids" uuid array, "file_urls" uuid array, CONSTRAINT "PK_98ba7faa0517bbf6d84af3564bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "prompts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_21f33798862975179e40b216a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "personas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_714aa5d028f8f3e6645e971cecd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chatbot_properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "chatbot_id" uuid NOT NULL, "prompt_id" uuid NOT NULL, "persona_id" uuid NOT NULL, "knowledge_id" uuid NOT NULL, CONSTRAINT "REL_9d8e8687d0301d5574bd767d37" UNIQUE ("prompt_id"), CONSTRAINT "REL_d4e973dcbc23eabfe8f0d6a87a" UNIQUE ("persona_id"), CONSTRAINT "REL_12bf4a2e1cf05a335c5ce4132e" UNIQUE ("knowledge_id"), CONSTRAINT "PK_d525f0c1466fc533b55ac332349" PRIMARY KEY ("id", "chatbot_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbots" ADD CONSTRAINT "FK_fdeffd3cd59f71371cd38420efd" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_28e6c9707905ad29dcc7c5fb5f1" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_d3e0a0722376318aca8985c6985" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_a53679287450d522a3f700088e9" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_properties" ADD CONSTRAINT "FK_a4820a4c43d8bff2c000c07bff7" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_properties" ADD CONSTRAINT "FK_9d8e8687d0301d5574bd767d378" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_properties" ADD CONSTRAINT "FK_d4e973dcbc23eabfe8f0d6a87a5" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_properties" ADD CONSTRAINT "FK_12bf4a2e1cf05a335c5ce4132ef" FOREIGN KEY ("knowledge_id") REFERENCES "knowledges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chatbot_properties" DROP CONSTRAINT "FK_12bf4a2e1cf05a335c5ce4132ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_properties" DROP CONSTRAINT "FK_d4e973dcbc23eabfe8f0d6a87a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_properties" DROP CONSTRAINT "FK_9d8e8687d0301d5574bd767d378"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbot_properties" DROP CONSTRAINT "FK_a4820a4c43d8bff2c000c07bff7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_a53679287450d522a3f700088e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_d3e0a0722376318aca8985c6985"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_28e6c9707905ad29dcc7c5fb5f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatbots" DROP CONSTRAINT "FK_fdeffd3cd59f71371cd38420efd"`,
    );
    await queryRunner.query(`DROP TABLE "chatbot_properties"`);
    await queryRunner.query(`DROP TABLE "personas"`);
    await queryRunner.query(`DROP TABLE "prompts"`);
    await queryRunner.query(`DROP TABLE "knowledges"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(
      `DROP TYPE "public"."messages_message_sender_enum"`,
    );
    await queryRunner.query(`DROP TABLE "participants"`);
    await queryRunner.query(`DROP TABLE "chatbots"`);
  }
}
