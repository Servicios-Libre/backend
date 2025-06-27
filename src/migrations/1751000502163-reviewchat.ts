import { MigrationInterface, QueryRunner } from "typeorm";

export class Reviewchat1751000502163 implements MigrationInterface {
    name = 'Reviewchat1751000502163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "REVIEWS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "rate" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '"2025-06-27T05:01:45.512Z"', "authorId" uuid, "workerId" uuid, CONSTRAINT "PK_fc038fca61fa79fc6d4fb1f9e51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" character varying NOT NULL, "message" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "chatId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "otherUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rate" double precision`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ADD CONSTRAINT "FK_87d247b48cccd3fec45c86a5bd4" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ADD CONSTRAINT "FK_2f870f3e064c9e130ddc3200eb4" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_300b012f638404dead3764ee201" FOREIGN KEY ("otherUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_300b012f638404dead3764ee201"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" DROP CONSTRAINT "FK_2f870f3e064c9e130ddc3200eb4"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" DROP CONSTRAINT "FK_87d247b48cccd3fec45c86a5bd4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rate" integer`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "otherUserId"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "REVIEWS"`);
    }

}
