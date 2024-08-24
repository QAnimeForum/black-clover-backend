import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1724480997123 implements MigrationInterface {
    name = ' $npmConfigName1724480997123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP CONSTRAINT "FK_a93ad6d97cfd5b1d2fd9d1f5c20"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP CONSTRAINT "FK_ca87e1d228ded08f3ee95e6bddb"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP COLUMN "invetoryId"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP COLUMN "inventoryId"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP COLUMN "equpmentItemId"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD "inventory_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD "equpment_item_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD CONSTRAINT "FK_1544f98947a066a4e47a308cce5" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD CONSTRAINT "FK_06c8d438df30ecdc5412bbe3c83" FOREIGN KEY ("equpment_item_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP CONSTRAINT "FK_06c8d438df30ecdc5412bbe3c83"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP CONSTRAINT "FK_1544f98947a066a4e47a308cce5"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP COLUMN "equpment_item_id"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP COLUMN "inventory_id"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD "equpmentItemId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD "inventoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD "invetoryId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD CONSTRAINT "FK_ca87e1d228ded08f3ee95e6bddb" FOREIGN KEY ("equpmentItemId") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD CONSTRAINT "FK_a93ad6d97cfd5b1d2fd9d1f5c20" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
