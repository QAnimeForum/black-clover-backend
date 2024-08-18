import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1723381838611 implements MigrationInterface {
    name = ' $npmConfigName1723381838611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" DROP COLUMN "nsright"`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" DROP COLUMN "nsleft"`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ADD "mpath" character varying DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ALTER COLUMN "star" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_hp" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_magic_power" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" DROP CONSTRAINT "FK_929c58456251556b2095ff58d9b"`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ALTER COLUMN "devil_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_hp" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_magic_power" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" DROP CONSTRAINT "FK_888b47b15df118f71e419c68419"`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ALTER COLUMN "star" SET NOT NULL`);
     //   await queryRunner.query(`ALTER TABLE "armed_forces_rank" ALTER COLUMN "parentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ALTER COLUMN "devil_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ADD CONSTRAINT "FK_888b47b15df118f71e419c68419" FOREIGN KEY ("parentId") REFERENCES "armed_forces_rank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ADD CONSTRAINT "FK_929c58456251556b2095ff58d9b" FOREIGN KEY ("devil_id") REFERENCES "devils"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devil_default_spells" DROP CONSTRAINT "FK_929c58456251556b2095ff58d9b"`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" DROP CONSTRAINT "FK_888b47b15df118f71e419c68419"`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ALTER COLUMN "devil_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ALTER COLUMN "parentId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ALTER COLUMN "star" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ADD CONSTRAINT "FK_888b47b15df118f71e419c68419" FOREIGN KEY ("parentId") REFERENCES "armed_forces_rank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_magic_power" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_hp" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ALTER COLUMN "devil_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devil_default_spells" ADD CONSTRAINT "FK_929c58456251556b2095ff58d9b" FOREIGN KEY ("devil_id") REFERENCES "devils"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_magic_power" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "bonus_hp" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ALTER COLUMN "star" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" DROP COLUMN "mpath"`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ADD "nsleft" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "armed_forces_rank" ADD "nsright" integer NOT NULL DEFAULT '2'`);
    }

}
