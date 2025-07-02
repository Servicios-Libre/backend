import { MigrationInterface, QueryRunner } from "typeorm";

export class Relationchatcontract1751422125426 implements MigrationInterface {
    name = 'Relationchatcontract1751422125426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ADD "chatId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-07-02T02:08:49.336Z"'`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_2837677c583a504b8ca0c1e7521" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_2837677c583a504b8ca0c1e7521"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-07-02 00:31:07.393'`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "chatId"`);
    }

}
