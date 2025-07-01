import { MigrationInterface, QueryRunner } from "typeorm";

export class Social1751391612409 implements MigrationInterface {
    name = 'Social1751391612409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "social" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "facebook" character varying, "instagram" character varying, "x" character varying, "linkedin" character varying, CONSTRAINT "PK_645aa1cff2b9f7b0e3e73d66b4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "socialId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_2025eaefc4e1b443c84f6ca9b2b" UNIQUE ("socialId")`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-07-01T17:40:15.812Z"'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_2025eaefc4e1b443c84f6ca9b2b" FOREIGN KEY ("socialId") REFERENCES "social"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2025eaefc4e1b443c84f6ca9b2b"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-07-01 01:07:26.82'`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_2025eaefc4e1b443c84f6ca9b2b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "socialId"`);
        await queryRunner.query(`DROP TABLE "social"`);
    }

}
