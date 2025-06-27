import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatUpdate1750997571403 implements MigrationInterface {
    name = 'ChatUpdate1750997571403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "user1"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "user2"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "otherUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_300b012f638404dead3764ee201" FOREIGN KEY ("otherUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_300b012f638404dead3764ee201"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "otherUserId"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "user2" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "user1" character varying NOT NULL`);
    }

}
