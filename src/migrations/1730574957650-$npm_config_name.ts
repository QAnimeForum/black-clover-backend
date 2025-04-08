import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1730574957650 implements MigrationInterface {
    name = ' $npmConfigName1730574957650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`CREATE TABLE "restaurant_menu" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a6420c3086d9d50d001cc01713" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurant_drinks" ("id" uuid NOT NULL, "menu_id" uuid NOT NULL, "drink_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b22c50488449a64481f0c367390" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drink_inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "inventory_id" uuid NOT NULL, "count" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "drink_id" uuid, CONSTRAINT "PK_51c9f581a6c12496d84c080df63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
        await queryRunner.query(`DROP TYPE "public"."drink_quality_enum"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "image_path" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD CONSTRAINT "FK_80ead5bc9b76b454fa9b82150a2" FOREIGN KEY ("menu_id") REFERENCES "restaurant_menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" ADD CONSTRAINT "FK_4bacb444170c0c6df00e121ce32" FOREIGN KEY ("drink_id") REFERENCES "drink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drink_inventory" ADD CONSTRAINT "FK_14f8e0204cb69e1b34749a11d17" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drink_inventory" ADD CONSTRAINT "FK_343cf6214027a7c01c7055d2e60" FOREIGN KEY ("drink_id") REFERENCES "drink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drink_inventory" DROP CONSTRAINT "FK_343cf6214027a7c01c7055d2e60"`);
        await queryRunner.query(`ALTER TABLE "drink_inventory" DROP CONSTRAINT "FK_14f8e0204cb69e1b34749a11d17"`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP CONSTRAINT "FK_4bacb444170c0c6df00e121ce32"`);
        await queryRunner.query(`ALTER TABLE "restaurant_drinks" DROP CONSTRAINT "FK_80ead5bc9b76b454fa9b82150a2"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "image_path"`);
        await queryRunner.query(`CREATE TYPE "public"."drink_quality_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "drink_inventory"`);
        await queryRunner.query(`DROP TABLE "restaurant_drinks"`);
        await queryRunner.query(`DROP TABLE "restaurant_menu"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
