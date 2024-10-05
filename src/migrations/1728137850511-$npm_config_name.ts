import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1728137850511 implements MigrationInterface {
    name = ' $npmConfigName1728137850511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "burg" DROP CONSTRAINT "FK_d51177135257fdd6c86a4262104"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP COLUMN "provinceId"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "name"`);
    //    await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
    //    await queryRunner.query(`DROP TYPE "public"."drink_quality_enum"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "appearance"`);
        await queryRunner.query(`ALTER TABLE "burg" ADD "province_id" uuid`);
        await queryRunner.query(`ALTER TABLE "burg" ADD "is_captial" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "burg" ADD "has_port" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "burg" ADD "has_walls" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "burg" ADD "has_shopping_area" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "burg" ADD "has_slum" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "province" ADD "description" character varying NOT NULL DEFAULT ''`);
    //   await queryRunner.query(`ALTER TABLE "drink_type" ADD "drinkImage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "appearance" character varying NOT NULL`);
    //    await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" DROP CONSTRAINT "FK_92faac90704a9f121d856bf5b7c"`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "burg" ADD CONSTRAINT "FK_99695e51611c91651ec91401ff4" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" ADD CONSTRAINT "FK_92faac90704a9f121d856bf5b7c" FOREIGN KEY ("drinkId") REFERENCES "drink"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_drinks" DROP CONSTRAINT "FK_92faac90704a9f121d856bf5b7c"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP CONSTRAINT "FK_99695e51611c91651ec91401ff4"`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" ADD CONSTRAINT "FK_92faac90704a9f121d856bf5b7c" FOREIGN KEY ("drinkId") REFERENCES "drink"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "appearance"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "drink_type" DROP COLUMN "drinkImage"`);
        await queryRunner.query(`ALTER TABLE "province" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP COLUMN "has_slum"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP COLUMN "has_shopping_area"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP COLUMN "has_walls"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP COLUMN "has_port"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP COLUMN "is_captial"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP COLUMN "province_id"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "appearance" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."drink_quality_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "burg" ADD "provinceId" uuid`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "burg" ADD CONSTRAINT "FK_d51177135257fdd6c86a4262104" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
