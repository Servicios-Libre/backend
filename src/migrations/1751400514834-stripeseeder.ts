import { MigrationInterface, QueryRunner } from "typeorm";

export class Stripeseeder1751400514834 implements MigrationInterface {
    name = 'Stripeseeder1751400514834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-07-01T20:08:38.394Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-07-01 20:01:16.357'`);
    }

}
