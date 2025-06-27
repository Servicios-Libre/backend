import { MigrationInterface, QueryRunner } from "typeorm";

export class Chatreview1751002007821 implements MigrationInterface {
    name = 'Chatreview1751002007821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-06-27T05:26:51.146Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-06-27 05:24:59.355'`);
    }

}
