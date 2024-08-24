import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1724480781131 implements MigrationInterface {
    name = ' $npmConfigName1724480781131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory_equipment_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invetoryId" character varying NOT NULL, "equpmentItemId" uuid NOT NULL, "inventoryId" uuid, CONSTRAINT "PK_3e50da5918e2f49baed33f76a29" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "devil_fragments" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD CONSTRAINT "FK_a93ad6d97cfd5b1d2fd9d1f5c20" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" ADD CONSTRAINT "FK_ca87e1d228ded08f3ee95e6bddb" FOREIGN KEY ("equpmentItemId") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP CONSTRAINT "FK_ca87e1d228ded08f3ee95e6bddb"`);
        await queryRunner.query(`ALTER TABLE "inventory_equipment_items" DROP CONSTRAINT "FK_a93ad6d97cfd5b1d2fd9d1f5c20"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "devil_fragments"`);
        await queryRunner.query(`DROP TABLE "inventory_equipment_items"`);
    }

}
