import { MigrationInterface, QueryRunner } from "typeorm";

export class Isread1751261651464 implements MigrationInterface {
    name = 'Isread1751261651464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "isRead" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-06-30T05:34:15.275Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-06-27 18:57:31.39'`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "isRead"`);
    }

}
