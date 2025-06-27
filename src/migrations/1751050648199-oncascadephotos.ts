import { MigrationInterface, QueryRunner } from "typeorm";

export class Oncascadephotos1751050648199 implements MigrationInterface {
    name = 'Oncascadephotos1751050648199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "WORK_PHOTOS" DROP CONSTRAINT "FK_85d8d06f7727e1ae01647c1d755"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-06-27T18:57:31.390Z"'`);
        await queryRunner.query(`ALTER TABLE "WORK_PHOTOS" ADD CONSTRAINT "FK_85d8d06f7727e1ae01647c1d755" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "WORK_PHOTOS" DROP CONSTRAINT "FK_85d8d06f7727e1ae01647c1d755"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-06-27 18:48:08.549'`);
        await queryRunner.query(`ALTER TABLE "WORK_PHOTOS" ADD CONSTRAINT "FK_85d8d06f7727e1ae01647c1d755" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
