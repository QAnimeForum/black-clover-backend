import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1725590151681 implements MigrationInterface {
    name = ' $npmConfigName1725590151681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shop" ADD "silver" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "gold" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "electrum" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "platinum" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_gold" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_electrum" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_silver" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_gold" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_electrum" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_silver" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_silver" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_electrum" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_gold" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_silver" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_electrum" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet" ALTER COLUMN "use_gold" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "platinum"`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "electrum"`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "gold"`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "silver"`);
    }

}
