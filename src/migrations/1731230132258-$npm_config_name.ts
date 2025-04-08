import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1731230132258 implements MigrationInterface {
    name = ' $npmConfigName1731230132258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP CONSTRAINT "FK_80ead5bc9b76b454fa9b82150a2"`);
        await queryRunner.query(`ALTER TABLE "restaurant_menu" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "restaurant_menu" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD CONSTRAINT "FK_80ead5bc9b76b454fa9b82150a2" FOREIGN KEY ("menu_id") REFERENCES "restaurant_menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP CONSTRAINT "FK_80ead5bc9b76b454fa9b82150a2"`);
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "restaurant_menu" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "restaurant_menu" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD CONSTRAINT "FK_80ead5bc9b76b454fa9b82150a2" FOREIGN KEY ("menu_id") REFERENCES "restaurant_menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
