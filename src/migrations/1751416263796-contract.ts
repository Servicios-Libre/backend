import { MigrationInterface, QueryRunner } from "typeorm";

export class Contract1751416263796 implements MigrationInterface {
    name = 'Contract1751416263796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ADD "clientConfirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "contract" ADD "workerConfirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "contract" ADD "completed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-07-02T00:31:07.393Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-07-01 20:24:41.627'`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "workerConfirmed"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "clientConfirmed"`);
    }

}
