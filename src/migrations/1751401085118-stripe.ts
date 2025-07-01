import { MigrationInterface, QueryRunner } from "typeorm";

export class Stripe1751401085118 implements MigrationInterface {
    name = 'Stripe1751401085118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "social" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "facebook" character varying, "instagram" character varying, "x" character varying, "linkedin" character varying, CONSTRAINT "PK_645aa1cff2b9f7b0e3e73d66b4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "stateId" integer, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "state" ("id" SERIAL NOT NULL, "state" character varying NOT NULL, CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "stripeCustomerId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "socialId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_2025eaefc4e1b443c84f6ca9b2b" UNIQUE ("socialId")`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-07-01T20:18:08.512Z"'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_2025eaefc4e1b443c84f6ca9b2b" FOREIGN KEY ("socialId") REFERENCES "social"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_ded8a17cd090922d5bac8a2361f" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_ded8a17cd090922d5bac8a2361f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2025eaefc4e1b443c84f6ca9b2b"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-07-01 20:15:48.962'`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_2025eaefc4e1b443c84f6ca9b2b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "socialId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "stripeCustomerId"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "social"`);
    }

}
