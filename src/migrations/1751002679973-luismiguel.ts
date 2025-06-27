import { MigrationInterface, QueryRunner } from 'typeorm';

export class DALEDIOS1751002679973 implements MigrationInterface {
  name = 'LUISMIGUEL1751002679973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // CREACIÓN DE LA TABLA "messages"
    await queryRunner.query(`
            CREATE TABLE "message" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "senderId" varchar NOT NULL,
                "message" text NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "chatId" uuid,
                CONSTRAINT "PK_message_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_message_chat" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "message"`);
  }
}
