import { MigrationInterface, QueryRunner } from "typeorm";

export class Facturacion1751516279768 implements MigrationInterface {
    name = 'Facturacion1751516279768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invoice_provider_enum" AS ENUM('mercado_pago', 'stripe')`);
        await queryRunner.query(`CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "externalReference" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "paymentMethod" character varying, "paymentType" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiredAt" TIMESTAMP NOT NULL DEFAULT now(), "provider" "public"."invoice_provider_enum" NOT NULL, "userId" uuid, CONSTRAINT "UQ_4f42dcf3ddb7cb0c7f3b096d016" UNIQUE ("externalReference"), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '"2025-07-03T04:18:03.514Z"'`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_f8e849201da83b87f78c7497dde"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ALTER COLUMN "created_at" SET DEFAULT '2025-07-03 04:16:18.224'`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TYPE "public"."invoice_provider_enum"`);
    }

}
