import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1751049974273 implements MigrationInterface {
    name = 'Initial1751049974273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CATEGORIES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "icon" character varying(30) NOT NULL DEFAULT 'face-smile', CONSTRAINT "UQ_47c74bcf8ffb7df9a1525c23420" UNIQUE ("name"), CONSTRAINT "PK_fdcef262c7ee3ae985f62b3695f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying, "house_number" integer, "city" character varying, "state" character varying, "zip_code" character varying, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."TICKETS_type_enum" AS ENUM('service', 'to-worker')`);
        await queryRunner.query(`CREATE TYPE "public"."TICKETS_status_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "TICKETS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."TICKETS_type_enum" NOT NULL, "status" "public"."TICKETS_status_enum" NOT NULL DEFAULT 'pending', "created_at" character varying(15) NOT NULL, "userId" uuid, "serviceId" uuid, CONSTRAINT "REL_0d9a1815b6648326f840afbb69" UNIQUE ("serviceId"), CONSTRAINT "PK_f56b5bf10cac39edb34fd08e8c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "REVIEWS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "rate" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '"2025-06-27T18:46:17.492Z"', "authorId" uuid, "workerId" uuid, CONSTRAINT "PK_fc038fca61fa79fc6d4fb1f9e51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" character varying NOT NULL, "message" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "chatId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otherUserId" uuid, "userId" uuid, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying(20), "role" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "rate" double precision, "experience" integer, "description" character varying, "availability" boolean NOT NULL DEFAULT false, "user_pic" character varying, "premium" boolean NOT NULL DEFAULT false, "addressIdId" uuid, CONSTRAINT "REL_6f64adba7c1c162c1543d8fff2" UNIQUE ("addressIdId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SERVICES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(50) NOT NULL, "description" text NOT NULL, "workerId" uuid, "categoryId" uuid, "ticketId" uuid, CONSTRAINT "REL_e2961370dcc799ec1bbb78659b" UNIQUE ("ticketId"), CONSTRAINT "PK_9fda3a48b803088840432592717" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "WORK_PHOTOS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "photo_url" text NOT NULL, "serviceId" uuid, CONSTRAINT "PK_aa0a23234bd68975360dee06fe3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workerId" character varying NOT NULL, "clientId" character varying NOT NULL, "description" text NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'pending', "payment" integer NOT NULL, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "TICKETS" ADD CONSTRAINT "FK_c884facc4917dd5d6bf8db8154d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TICKETS" ADD CONSTRAINT "FK_0d9a1815b6648326f840afbb694" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ADD CONSTRAINT "FK_87d247b48cccd3fec45c86a5bd4" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" ADD CONSTRAINT "FK_2f870f3e064c9e130ddc3200eb4" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_300b012f638404dead3764ee201" FOREIGN KEY ("otherUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6f64adba7c1c162c1543d8fff2c" FOREIGN KEY ("addressIdId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SERVICES" ADD CONSTRAINT "FK_2a09ace3695ac43f27ea451aefd" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SERVICES" ADD CONSTRAINT "FK_bbf93b5bfb4c25a947ad27dc43c" FOREIGN KEY ("categoryId") REFERENCES "CATEGORIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SERVICES" ADD CONSTRAINT "FK_e2961370dcc799ec1bbb78659b0" FOREIGN KEY ("ticketId") REFERENCES "TICKETS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "WORK_PHOTOS" ADD CONSTRAINT "FK_85d8d06f7727e1ae01647c1d755" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "WORK_PHOTOS" DROP CONSTRAINT "FK_85d8d06f7727e1ae01647c1d755"`);
        await queryRunner.query(`ALTER TABLE "SERVICES" DROP CONSTRAINT "FK_e2961370dcc799ec1bbb78659b0"`);
        await queryRunner.query(`ALTER TABLE "SERVICES" DROP CONSTRAINT "FK_bbf93b5bfb4c25a947ad27dc43c"`);
        await queryRunner.query(`ALTER TABLE "SERVICES" DROP CONSTRAINT "FK_2a09ace3695ac43f27ea451aefd"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6f64adba7c1c162c1543d8fff2c"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_300b012f638404dead3764ee201"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" DROP CONSTRAINT "FK_2f870f3e064c9e130ddc3200eb4"`);
        await queryRunner.query(`ALTER TABLE "REVIEWS" DROP CONSTRAINT "FK_87d247b48cccd3fec45c86a5bd4"`);
        await queryRunner.query(`ALTER TABLE "TICKETS" DROP CONSTRAINT "FK_0d9a1815b6648326f840afbb694"`);
        await queryRunner.query(`ALTER TABLE "TICKETS" DROP CONSTRAINT "FK_c884facc4917dd5d6bf8db8154d"`);
        await queryRunner.query(`DROP TABLE "contract"`);
        await queryRunner.query(`DROP TABLE "WORK_PHOTOS"`);
        await queryRunner.query(`DROP TABLE "SERVICES"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "REVIEWS"`);
        await queryRunner.query(`DROP TABLE "TICKETS"`);
        await queryRunner.query(`DROP TYPE "public"."TICKETS_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."TICKETS_type_enum"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "CATEGORIES"`);
    }

}
