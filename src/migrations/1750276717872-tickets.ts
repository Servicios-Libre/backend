import { MigrationInterface, QueryRunner } from "typeorm";

export class Tickets1750276717872 implements MigrationInterface {
    name = 'Tickets1750276717872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."TICKETS_type_enum" AS ENUM('service', 'to-worker')`);
        await queryRunner.query(`CREATE TYPE "public"."TICKETS_status_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "TICKETS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."TICKETS_type_enum" NOT NULL, "status" "public"."TICKETS_status_enum" NOT NULL DEFAULT 'pending', "created_at" character varying(15) NOT NULL, "userId" uuid, "serviceId" uuid, CONSTRAINT "REL_0d9a1815b6648326f840afbb69" UNIQUE ("serviceId"), CONSTRAINT "PK_f56b5bf10cac39edb34fd08e8c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "SERVICES" ADD "ticketId" uuid`);
        await queryRunner.query(`ALTER TABLE "SERVICES" ADD CONSTRAINT "UQ_e2961370dcc799ec1bbb78659b0" UNIQUE ("ticketId")`);
        await queryRunner.query(`ALTER TABLE "TICKETS" ADD CONSTRAINT "FK_c884facc4917dd5d6bf8db8154d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TICKETS" ADD CONSTRAINT "FK_0d9a1815b6648326f840afbb694" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SERVICES" ADD CONSTRAINT "FK_e2961370dcc799ec1bbb78659b0" FOREIGN KEY ("ticketId") REFERENCES "TICKETS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SERVICES" DROP CONSTRAINT "FK_e2961370dcc799ec1bbb78659b0"`);
        await queryRunner.query(`ALTER TABLE "TICKETS" DROP CONSTRAINT "FK_0d9a1815b6648326f840afbb694"`);
        await queryRunner.query(`ALTER TABLE "TICKETS" DROP CONSTRAINT "FK_c884facc4917dd5d6bf8db8154d"`);
        await queryRunner.query(`ALTER TABLE "SERVICES" DROP CONSTRAINT "UQ_e2961370dcc799ec1bbb78659b0"`);
        await queryRunner.query(`ALTER TABLE "SERVICES" DROP COLUMN "ticketId"`);
        await queryRunner.query(`DROP TABLE "TICKETS"`);
        await queryRunner.query(`DROP TYPE "public"."TICKETS_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."TICKETS_type_enum"`);
    }

}
