import { MigrationInterface, QueryRunner } from "typeorm";

export class Newmig1750911205406 implements MigrationInterface {
    name = 'Newmig1750911205406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" RENAME COLUMN "content" TO "message"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" RENAME COLUMN "message" TO "content"`);
    }

}
