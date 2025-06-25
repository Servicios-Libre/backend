import { MigrationInterface, QueryRunner } from "typeorm";

export class Socket1750889308292 implements MigrationInterface {
    name = 'Socket1750889308292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" character varying NOT NULL, "content" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "chatId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "receiverId"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "user1" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "user2" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "user2"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "user1"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "timestamp" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "receiverId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "senderId" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
