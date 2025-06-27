import { MigrationInterface, QueryRunner } from "typeorm";

export class Oncascade1751049490081 implements MigrationInterface {
    name = 'Oncascade1751049490081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TICKETS" DROP CONSTRAINT "FK_0d9a1815b6648326f840afbb694"`);
        await queryRunner.query(`ALTER TABLE "SERVICES" DROP CONSTRAINT "FK_e2961370dcc799ec1bbb78659b0"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-06-27T18:38:13.370Z"'`);
        await queryRunner.query(`ALTER TABLE "TICKETS" ADD CONSTRAINT "FK_0d9a1815b6648326f840afbb694" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SERVICES" ADD CONSTRAINT "FK_e2961370dcc799ec1bbb78659b0" FOREIGN KEY ("ticketId") REFERENCES "TICKETS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SERVICES" DROP CONSTRAINT "FK_e2961370dcc799ec1bbb78659b0"`);
        await queryRunner.query(`ALTER TABLE "TICKETS" DROP CONSTRAINT "FK_0d9a1815b6648326f840afbb694"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-06-27 18:32:12.306'`);
        await queryRunner.query(`ALTER TABLE "SERVICES" ADD CONSTRAINT "FK_e2961370dcc799ec1bbb78659b0" FOREIGN KEY ("ticketId") REFERENCES "TICKETS"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TICKETS" ADD CONSTRAINT "FK_0d9a1815b6648326f840afbb694" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
