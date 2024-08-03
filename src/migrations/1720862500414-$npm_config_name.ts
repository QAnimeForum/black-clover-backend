import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1720862500414 implements MigrationInterface {
    name = ' $npmConfigName1720862500414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_hp" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_magic_power" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" DROP CONSTRAINT "FK_929c58456251556b2095ff58d9b"`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ALTER COLUMN "devil_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_hp" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_magic_power" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ALTER COLUMN "devil_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ADD CONSTRAINT "FK_929c58456251556b2095ff58d9b" FOREIGN KEY ("devil_id") REFERENCES "devils"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devil_default_spells" DROP CONSTRAINT "FK_929c58456251556b2095ff58d9b"`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ALTER COLUMN "devil_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_magic_power" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_hp" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ALTER COLUMN "devil_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ADD CONSTRAINT "FK_929c58456251556b2095ff58d9b" FOREIGN KEY ("devil_id") REFERENCES "devils"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_magic_power" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_hp" DROP NOT NULL`);
    }

}
