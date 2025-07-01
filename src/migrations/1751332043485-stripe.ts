import { MigrationInterface, QueryRunner } from "typeorm";

export class Stripe1751332043485 implements MigrationInterface {
    name = 'Stripe1751332043485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "stripeCustomerId" character varying`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-07-01T01:07:26.820Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-06-30 05:34:15.275'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "stripeCustomerId"`);
    }

}
