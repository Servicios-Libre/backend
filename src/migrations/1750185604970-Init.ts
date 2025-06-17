import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1750185604970 implements MigrationInterface {
  name = 'Init1750185604970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CATEGORIES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "icon" character varying(30) NOT NULL DEFAULT 'face-smile', CONSTRAINT "UQ_47c74bcf8ffb7df9a1525c23420" UNIQUE ("name"), CONSTRAINT "PK_fdcef262c7ee3ae985f62b3695f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "house_number" integer, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying(20) NOT NULL, "role" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "rate" integer, "experience" integer, "description" character varying, "availability" boolean NOT NULL DEFAULT false, "user_pic" character varying, "premium" boolean NOT NULL DEFAULT false, "addressIdId" uuid, CONSTRAINT "REL_6f64adba7c1c162c1543d8fff2" UNIQUE ("addressIdId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "SERVICES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(50) NOT NULL, "description" text NOT NULL, "workerId" uuid, "categoryId" uuid, CONSTRAINT "PK_9fda3a48b803088840432592717" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "WORK_PHOTOS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "photo_url" text NOT NULL, "serviceId" uuid, CONSTRAINT "PK_aa0a23234bd68975360dee06fe3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_6f64adba7c1c162c1543d8fff2c" FOREIGN KEY ("addressIdId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICES" ADD CONSTRAINT "FK_2a09ace3695ac43f27ea451aefd" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICES" ADD CONSTRAINT "FK_bbf93b5bfb4c25a947ad27dc43c" FOREIGN KEY ("categoryId") REFERENCES "CATEGORIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "WORK_PHOTOS" ADD CONSTRAINT "FK_85d8d06f7727e1ae01647c1d755" FOREIGN KEY ("serviceId") REFERENCES "SERVICES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "WORK_PHOTOS" DROP CONSTRAINT "FK_85d8d06f7727e1ae01647c1d755"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICES" DROP CONSTRAINT "FK_bbf93b5bfb4c25a947ad27dc43c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SERVICES" DROP CONSTRAINT "FK_2a09ace3695ac43f27ea451aefd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_6f64adba7c1c162c1543d8fff2c"`,
    );
    await queryRunner.query(`DROP TABLE "WORK_PHOTOS"`);
    await queryRunner.query(`DROP TABLE "SERVICES"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "CATEGORIES"`);
  }
}
