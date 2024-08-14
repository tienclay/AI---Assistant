import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingScheduleJob1723629535745 implements MigrationInterface {
    name = 'AddingScheduleJob1723629535745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."schedule_jobs_status_enum" AS ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "schedule_jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "interval" integer, "is_recurring" boolean NOT NULL DEFAULT false, "next_execution_time" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."schedule_jobs_status_enum" NOT NULL DEFAULT 'PENDING', "data" jsonb NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_73748eb31ce95d0832b9fb0be0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."task_execution_histories_status_enum" AS ENUM('SUCCESS', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "task_execution_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "job_id" uuid NOT NULL, "execution_time" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."task_execution_histories_status_enum" NOT NULL, CONSTRAINT "PK_563948343aa57ab99a3eafdf165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "schedule_jobs" ADD CONSTRAINT "FK_c39f765d8b5e70285c9ab450abe" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_execution_histories" ADD CONSTRAINT "FK_fcf4968d72ecacd447315cddd7c" FOREIGN KEY ("job_id") REFERENCES "schedule_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_execution_histories" DROP CONSTRAINT "FK_fcf4968d72ecacd447315cddd7c"`);
        await queryRunner.query(`ALTER TABLE "schedule_jobs" DROP CONSTRAINT "FK_c39f765d8b5e70285c9ab450abe"`);
        await queryRunner.query(`DROP TABLE "task_execution_histories"`);
        await queryRunner.query(`DROP TYPE "public"."task_execution_histories_status_enum"`);
        await queryRunner.query(`DROP TABLE "schedule_jobs"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_jobs_status_enum"`);
    }

}
