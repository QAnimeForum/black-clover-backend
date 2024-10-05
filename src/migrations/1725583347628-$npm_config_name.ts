import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1725583347628 implements MigrationInterface {
    name = ' $npmConfigName1725583347628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "useElectrum"`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "use_gold" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "use_electrum" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "use_silver" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "copper" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_platinum" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_gold" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_electrum" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_silver" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_silver" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_electrum" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_gold" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_platinum" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "copper"`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "copper"`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "copper"`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "copper"`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "copper"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "use_silver"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "use_electrum"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "use_gold"`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "useElectrum" boolean NOT NULL`);
    }

}
