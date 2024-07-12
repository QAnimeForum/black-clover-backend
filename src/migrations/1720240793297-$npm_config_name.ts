import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1720240793297 implements MigrationInterface {
    name = ' $npmConfigName1720240793297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spell" DROP CONSTRAINT "FK_1e2393cb4b4223f42e4e91d91dc"`);
        await queryRunner.query(`ALTER TABLE "spell" DROP COLUMN "gromoire_id"`);
        await queryRunner.query(`ALTER TABLE "spell" ALTER COLUMN "grimoire_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "spell" ALTER COLUMN "grimoire_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "spell" ADD CONSTRAINT "FK_b4bafebc074802e2ef7d21e3a1b" FOREIGN KEY ("grimoire_id") REFERENCES "grimoire"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spell" DROP CONSTRAINT "FK_b4bafebc074802e2ef7d21e3a1b"`);
        await queryRunner.query(`ALTER TABLE "spell" ALTER COLUMN "grimoire_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "spell" ALTER COLUMN "grimoire_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "spell" ADD "gromoire_id" uuid`);
        await queryRunner.query(`ALTER TABLE "spell" ADD CONSTRAINT "FK_1e2393cb4b4223f42e4e91d91dc" FOREIGN KEY ("gromoire_id") REFERENCES "grimoire"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
