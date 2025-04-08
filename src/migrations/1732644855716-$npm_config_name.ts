import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1732644855716 implements MigrationInterface {
    name = ' $npmConfigName1732644855716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD "copper" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD "silver" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD "electrum" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD "gold" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD "platinum" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP COLUMN "platinum"`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP COLUMN "gold"`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP COLUMN "electrum"`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP COLUMN "silver"`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP COLUMN "copper"`);
    }

}
