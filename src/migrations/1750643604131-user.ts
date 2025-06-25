import { MigrationInterface, QueryRunner } from "typeorm";

export class User1750643604131 implements MigrationInterface {
    name = 'User1750643604131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "street" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "state" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "state" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "street" SET NOT NULL`);
    }

}
