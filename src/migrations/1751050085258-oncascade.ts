import { MigrationInterface, QueryRunner } from "typeorm";

export class Oncascade1751050085258 implements MigrationInterface {
    name = 'Oncascade1751050085258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TICKETS" DROP CONSTRAINT "FK_0d9a1815b6648326f840afbb694"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-06-27T18:48:08.549Z"'`);
        await queryRunner.query(`ALTER TABLE "TICKETS" ADD CONSTRAINT "FK_0d9a1815b6648326f840afbb694" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TICKETS" DROP CONSTRAINT "FK_0d9a1815b6648326f840afbb694"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-06-27 18:46:17.492'`);
        await queryRunner.query(`ALTER TABLE "TICKETS" ADD CONSTRAINT "FK_0d9a1815b6648326f840afbb694" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
