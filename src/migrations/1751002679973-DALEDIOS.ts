import { MigrationInterface, QueryRunner } from "typeorm";

export class DALEDIOS1751002679973 implements MigrationInterface {
    name = 'DALEDIOS1751002679973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "REVIEWS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "rate" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '"2025-06-27T05:38:03.216Z"', "authorId" uuid, "workerId" uuid, CONSTRAINT "PK_fc038fca61fa79fc6d4fb1f9e51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rate" double precision`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ADD CONSTRAINT "FK_87d247b48cccd3fec45c86a5bd4" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ADD CONSTRAINT "FK_2f870f3e064c9e130ddc3200eb4" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" DROP CONSTRAINT "FK_2f870f3e064c9e130ddc3200eb4"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" DROP CONSTRAINT "FK_87d247b48cccd3fec45c86a5bd4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rate" integer`);
        await queryRunner.query(`DROP TABLE "REVIEWS"`);
    }

}
