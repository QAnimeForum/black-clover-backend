import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1727012763127 implements MigrationInterface {
    name = ' $npmConfigName1727012763127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_3005223ba91709f26b9e6e347ae"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_7f0f1e87d014b4b627ce6dfe890"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_fbbd94225e1292b442e352d8209"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_8afb00abb0da8ce7037bb509022"`);
        await queryRunner.query(`ALTER TABLE "equpment_item" RENAME COLUMN "bodyPart" TO "body_part"`);
        await queryRunner.query(`ALTER TYPE "public"."equpment_item_bodypart_enum" RENAME TO "equpment_item_body_part_enum"`);
        await queryRunner.query(`CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_233978864a48c44d3fcafe01573" UNIQUE ("name"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "beverage_container" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "type_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8536bb9cc378da7e03e358a2aad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "REL_3005223ba91709f26b9e6e347a"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "price_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "drink_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "strength"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP COLUMN "ring_id"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP COLUMN "shoes_id"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD "headdress_id" uuid`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD "feet_id" uuid`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD "accessory_id" uuid`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
        await queryRunner.query(`CREATE TYPE "public"."drink_quality_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "quality" "public"."drink_quality_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TYPE "public"."equpment_item_rarity_enum" RENAME TO "equpment_item_rarity_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."equpment_item_rarity_enum" AS ENUM('GARBAGE', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'UNIQUE')`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "rarity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "rarity" TYPE "public"."equpment_item_rarity_enum" USING "rarity"::"text"::"public"."equpment_item_rarity_enum"`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "rarity" SET DEFAULT 'COMMON'`);
        await queryRunner.query(`DROP TYPE "public"."equpment_item_rarity_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."equpment_item_body_part_enum" RENAME TO "equpment_item_body_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."equpment_item_body_part_enum" AS ENUM('HEADDRESS', 'ARMOR', 'CLOAK', 'HAND', 'TWO_HANDS', 'GLOVES', 'FEET', 'ACCESSORY')`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "body_part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "body_part" TYPE "public"."equpment_item_body_part_enum" USING "body_part"::"text"::"public"."equpment_item_body_part_enum"`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "body_part" SET DEFAULT 'ACCESSORY'`);
        await queryRunner.query(`DROP TYPE "public"."equpment_item_body_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_8f73079073c0659509a6c455ae7" FOREIGN KEY ("type_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_bf316fbaa70bbcc441d388da90c" FOREIGN KEY ("feet_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_82de1f9e8aefd6fb6d536ea6491" FOREIGN KEY ("accessory_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_82de1f9e8aefd6fb6d536ea6491"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_bf316fbaa70bbcc441d388da90c"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP CONSTRAINT "FK_8f73079073c0659509a6c455ae7"`);
        await queryRunner.query(`CREATE TYPE "public"."equpment_item_body_part_enum_old" AS ENUM('GLOVES', 'LEEGS', 'FEET', 'HAND', 'TWO_HANDS', 'HEADDRESS', 'ARMOR', 'CLOAK', 'SHOES', 'RING', 'VEHICLE', 'NO')`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "body_part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "body_part" TYPE "public"."equpment_item_body_part_enum_old" USING "body_part"::"text"::"public"."equpment_item_body_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "body_part" SET DEFAULT 'NO'`);
        await queryRunner.query(`DROP TYPE "public"."equpment_item_body_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."equpment_item_body_part_enum_old" RENAME TO "equpment_item_body_part_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."equpment_item_rarity_enum_old" AS ENUM('COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'UNIQUE', 'EPIC')`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "rarity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "rarity" TYPE "public"."equpment_item_rarity_enum_old" USING "rarity"::"text"::"public"."equpment_item_rarity_enum_old"`);
        await queryRunner.query(`ALTER TABLE "equpment_item" ALTER COLUMN "rarity" SET DEFAULT 'COMMON'`);
        await queryRunner.query(`DROP TYPE "public"."equpment_item_rarity_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."equpment_item_rarity_enum_old" RENAME TO "equpment_item_rarity_enum"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "quality"`);
        await queryRunner.query(`DROP TYPE "public"."drink_quality_enum"`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "quality" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP COLUMN "accessory_id"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP COLUMN "feet_id"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP COLUMN "headdress_id"`);
        await queryRunner.query(`ALTER TABLE "drink" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD "shoes_id" uuid`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD "ring_id" uuid`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "strength" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "drink_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drink" ADD "price_id" uuid`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "REL_3005223ba91709f26b9e6e347a" UNIQUE ("price_id")`);
        await queryRunner.query(`DROP TABLE "beverage_container"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`ALTER TYPE "public"."equpment_item_body_part_enum" RENAME TO "equpment_item_bodypart_enum"`);
        await queryRunner.query(`ALTER TABLE "equpment_item" RENAME COLUMN "body_part" TO "bodyPart"`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_8afb00abb0da8ce7037bb509022" FOREIGN KEY ("ring_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_fbbd94225e1292b442e352d8209" FOREIGN KEY ("shoes_id") REFERENCES "equpment_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_7f0f1e87d014b4b627ce6dfe890" FOREIGN KEY ("drink_id") REFERENCES "drink_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drink" ADD CONSTRAINT "FK_3005223ba91709f26b9e6e347ae" FOREIGN KEY ("price_id") REFERENCES "money"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
