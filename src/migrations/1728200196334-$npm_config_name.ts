import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1728200196334 implements MigrationInterface {
    name = ' $npmConfigName1728200196334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`CREATE TABLE "resurce_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parentId" uuid, "name" character varying(30) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ac8a7ec15b2e5d763b94081112f" UNIQUE ("name"), CONSTRAINT "PK_efb347d9defb8d06eb391d0d7b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "description" text NOT NULL, "edible" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid, CONSTRAINT "UQ_c8ed18ff47475e2c4a7bf59daa0" UNIQUE ("name"), CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resurce_category_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_4e85514bbfed20692879ae4915c" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_33d28941d39c03a56de5e5c401" ON "resurce_category_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_b6c0c6f3e666fb6fd2704e2d41" ON "resurce_category_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "appearance"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "description"`);
   //     await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
   //     await queryRunner.query(`DROP TYPE "public"."drink_quality_enum"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "appearance" character varying NOT NULL`);
   //     await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" DROP CONSTRAINT "FK_92faac90704a9f121d856bf5b7c"`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
      //  await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resurce_category" ADD CONSTRAINT "FK_c5bccb29879b24f50b0507ac632" FOREIGN KEY ("parentId") REFERENCES "resurce_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_477e614ecbd504c16e97402dcd4" FOREIGN KEY ("category_id") REFERENCES "resurce_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" ADD CONSTRAINT "FK_92faac90704a9f121d856bf5b7c" FOREIGN KEY ("drinkId") REFERENCES "drink"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "resurce_category_closure" ADD CONSTRAINT "FK_33d28941d39c03a56de5e5c4015" FOREIGN KEY ("id_ancestor") REFERENCES "resurce_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resurce_category_closure" ADD CONSTRAINT "FK_b6c0c6f3e666fb6fd2704e2d415" FOREIGN KEY ("id_descendant") REFERENCES "resurce_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resurce_category_closure" DROP CONSTRAINT "FK_b6c0c6f3e666fb6fd2704e2d415"`);
        await queryRunner.query(`ALTER TABLE "resurce_category_closure" DROP CONSTRAINT "FK_33d28941d39c03a56de5e5c4015"`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" DROP CONSTRAINT "FK_92faac90704a9f121d856bf5b7c"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_477e614ecbd504c16e97402dcd4"`);
        await queryRunner.query(`ALTER TABLE "resurce_category" DROP CONSTRAINT "FK_c5bccb29879b24f50b0507ac632"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" ADD CONSTRAINT "FK_92faac90704a9f121d856bf5b7c" FOREIGN KEY ("drinkId") REFERENCES "drink"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "appearance"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."drink_quality_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "appearance" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6c0c6f3e666fb6fd2704e2d41"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33d28941d39c03a56de5e5c401"`);
        await queryRunner.query(`DROP TABLE "resurce_category_closure"`);
        await queryRunner.query(`DROP TABLE "resource"`);
        await queryRunner.query(`DROP TABLE "resurce_category"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
