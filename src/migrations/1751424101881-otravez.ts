import { MigrationInterface, QueryRunner } from "typeorm";

export class Otravez1751424101881 implements MigrationInterface {
    name = 'Otravez1751424101881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" ADD "contractId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-07-02T02:41:45.801Z"'`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ADD CONSTRAINT "FK_279934d2129e08b7a28b607d030" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REVIEWS" DROP CONSTRAINT "FK_279934d2129e08b7a28b607d030"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-07-02 02:08:49.336'`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" DROP COLUMN "contractId"`);
    }

}
