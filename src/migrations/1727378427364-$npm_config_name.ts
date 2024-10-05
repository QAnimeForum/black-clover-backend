import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1727378427364 implements MigrationInterface {
    name = ' $npmConfigName1727378427364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "name"`);
     //   await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
   //     await queryRunner.query(`DROP TYPE "public"."drink_quality_enum"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "appearance"`);
        await queryRunner.query(`ALTER TABLE "drink_type" ADD "drinkImage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "appearance" character varying NOT NULL`);
    //   await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" DROP CONSTRAINT "FK_92faac90704a9f121d856bf5b7c"`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" ADD CONSTRAINT "FK_92faac90704a9f121d856bf5b7c" FOREIGN KEY ("drinkId") REFERENCES "drink"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_drinks" DROP CONSTRAINT "FK_92faac90704a9f121d856bf5b7c"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" ADD CONSTRAINT "FK_92faac90704a9f121d856bf5b7c" FOREIGN KEY ("drinkId") REFERENCES "drink"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "appearance"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "drink_type" DROP COLUMN "drinkImage"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "appearance" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."drink_quality_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
