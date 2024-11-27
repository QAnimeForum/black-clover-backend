import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1729531697394 implements MigrationInterface {
    name = ' $npmConfigName1729531697394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_47b202030602e0e1f9b540c446d"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_07374c077af07d2795c2eb3b88a"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_de14170221deb328d30d78a3775"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_a5f321d7010ff4d4dad3ce48065"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_e735e2987b4d7cd48b9fdc09542"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_50b7d984bf278d5b1957e87f516"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_61667b05c492f7f5db0b52bc3b4"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_bf316fbaa70bbcc441d388da90c"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_82de1f9e8aefd6fb6d536ea6491"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_477e614ecbd504c16e97402dcd4"`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "category_id" SET NOT NULL`);
  //      await queryRunner.query(`ALTER TABLE "inventory_drinks" DROP CONSTRAINT "FK_92faac90704a9f121d856bf5b7c"`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "category_id" SET NOT NULL`);
     //   await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_47b202030602e0e1f9b540c446d" FOREIGN KEY ("cap_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_07374c077af07d2795c2eb3b88a" FOREIGN KEY ("armor_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_de14170221deb328d30d78a3775" FOREIGN KEY ("cloak_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_a5f321d7010ff4d4dad3ce48065" FOREIGN KEY ("left_hand_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_e735e2987b4d7cd48b9fdc09542" FOREIGN KEY ("right_hand_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_50b7d984bf278d5b1957e87f516" FOREIGN KEY ("gloves_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_bf316fbaa70bbcc441d388da90c" FOREIGN KEY ("feet_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_82de1f9e8aefd6fb6d536ea6491" FOREIGN KEY ("accessory_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_61667b05c492f7f5db0b52bc3b4" FOREIGN KEY ("vehicle_id") REFERENCES "inventory_equipment_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_477e614ecbd504c16e97402dcd4" FOREIGN KEY ("category_id") REFERENCES "resurce_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_drinks" DROP CONSTRAINT "FK_92faac90704a9f121d856bf5b7c"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_477e614ecbd504c16e97402dcd4"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_61667b05c492f7f5db0b52bc3b4"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_82de1f9e8aefd6fb6d536ea6491"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_bf316fbaa70bbcc441d388da90c"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_50b7d984bf278d5b1957e87f516"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_e735e2987b4d7cd48b9fdc09542"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_a5f321d7010ff4d4dad3ce48065"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_de14170221deb328d30d78a3775"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_07374c077af07d2795c2eb3b88a"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_47b202030602e0e1f9b540c446d"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "category_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "inventory_drinks" ADD CONSTRAINT "FK_92faac90704a9f121d856bf5b7c" FOREIGN KEY ("drinkId") REFERENCES "drink"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "category_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_477e614ecbd504c16e97402dcd4" FOREIGN KEY ("category_id") REFERENCES "resurce_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "appearance"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "appearance" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."drink_quality_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_82de1f9e8aefd6fb6d536ea6491" FOREIGN KEY ("accessory_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_bf316fbaa70bbcc441d388da90c" FOREIGN KEY ("feet_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_61667b05c492f7f5db0b52bc3b4" FOREIGN KEY ("vehicle_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_50b7d984bf278d5b1957e87f516" FOREIGN KEY ("gloves_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_e735e2987b4d7cd48b9fdc09542" FOREIGN KEY ("right_hand_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_a5f321d7010ff4d4dad3ce48065" FOREIGN KEY ("left_hand_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_de14170221deb328d30d78a3775" FOREIGN KEY ("cloak_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_07374c077af07d2795c2eb3b88a" FOREIGN KEY ("armor_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_47b202030602e0e1f9b540c446d" FOREIGN KEY ("cap_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
