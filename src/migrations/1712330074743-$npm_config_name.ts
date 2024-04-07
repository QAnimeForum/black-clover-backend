import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1712330074743 implements MigrationInterface {
    name = ' $npmConfigName1712330074743';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "telegram_id" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "burg" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "provinceId" uuid, CONSTRAINT "PK_3f599743b5ef43b82430448c756" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "province_form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_7100060d132705fe129ff576026" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "province" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "short_name" character varying NOT NULL, "full_name" character varying NOT NULL, "state_id" uuid, "form_id" uuid, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "stateform" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_8a14859db916aeda81c38a99b15" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "fullName" character varying NOT NULL, "description" character varying NOT NULL, "form_id" uuid, CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "ability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "abbr" character varying NOT NULL, "score" integer NOT NULL, "modifier" integer NOT NULL, CONSTRAINT "PK_5643559d435d01ec126981417a2" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "weapons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "weaponType" character varying NOT NULL, "cost" character varying NOT NULL, "damage" character varying NOT NULL, "damageType" character varying NOT NULL, "weight" character varying NOT NULL, "inventory_id" uuid, CONSTRAINT "PK_a102f55ffbab023a922ac10ab76" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "toolKit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "kit" character varying NOT NULL, "cost" character varying NOT NULL, "weight" character varying NOT NULL, "description" character varying NOT NULL, "inventory_id" uuid, CONSTRAINT "PK_96b9d5a2e4c820007e0eaaf4954" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemType" character varying NOT NULL, "quantity" integer NOT NULL, "cost" character varying NOT NULL, "weight" character varying NOT NULL, "description" character varying NOT NULL, "inventory_id" uuid, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "govNumber" character varying NOT NULL, "fuel" integer NOT NULL, "state" integer NOT NULL, "tuning" character varying NOT NULL, "inventory_id" uuid, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "armor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "armorType" character varying NOT NULL, "cost" character varying NOT NULL, "ac_base" integer NOT NULL, "ac_bonus" integer NOT NULL, "stealthDisadvantage" boolean NOT NULL, "weight" character varying NOT NULL, "inventory_id" uuid, CONSTRAINT "PK_9897d8f2edafda53ca0412ddeec" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "armor_class" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "base" integer NOT NULL, "bonus" integer NOT NULL, CONSTRAINT "PK_5ba1e32999f6b0ce7c57665e4da" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "speed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "base" integer NOT NULL, "bonus" integer NOT NULL, "character_characteristics_id" uuid, CONSTRAINT "PK_3725257a5ff7a71c525874d4444" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "proficiency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "level" integer NOT NULL, "extraBonus" integer NOT NULL, CONSTRAINT "PK_5d1139f6dd3f59ad11b90b5fc57" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "сharacter_сharacteristics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "experience" integer NOT NULL, "current_level" integer NOT NULL, "max_level" integer NOT NULL, "currentHealth" integer NOT NULL, "maxHealth" integer NOT NULL, "hunger" character varying NOT NULL, "sanity" integer NOT NULL, "proficiency_id" uuid, "strength_id" uuid, "dexterity_id" uuid, "constitution_id" uuid, "intelligence_id" uuid, "wisdom_id" uuid, "charisma_id" uuid, "armor_class_id" uuid, CONSTRAINT "REL_3de7660ddbb03266bf3b45f46b" UNIQUE ("proficiency_id"), CONSTRAINT "REL_a33571e93e431bf7954a725810" UNIQUE ("strength_id"), CONSTRAINT "REL_2266566630597e725171d7d149" UNIQUE ("dexterity_id"), CONSTRAINT "REL_20cdb54b7dc2dfc3b1608d9272" UNIQUE ("constitution_id"), CONSTRAINT "REL_bec0cf5cc8f25e02155802a1ff" UNIQUE ("intelligence_id"), CONSTRAINT "REL_3ff92766c0608a72fad9bcd4fc" UNIQUE ("wisdom_id"), CONSTRAINT "REL_e755b69e23f6f408b4dd3a8c16" UNIQUE ("charisma_id"), CONSTRAINT "REL_d60a5a2c749df61c88346e6096" UNIQUE ("armor_class_id"), CONSTRAINT "PK_9ecdbc6923171be1ee71bca3ea2" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "spell" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "school" character varying NOT NULL, "castTime" character varying NOT NULL, "range" character varying NOT NULL, "concentration" boolean NOT NULL, "duration" character varying NOT NULL, "material" character varying NOT NULL, "minimumLevel" character varying NOT NULL, "ritual" boolean NOT NULL, "spellAttack" boolean NOT NULL, "spellcastingAbility" character varying NOT NULL, "grimoireId" uuid, CONSTRAINT "PK_148c7e69812f7047fe34e3848fa" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."grimoire_coversymbol_enum" AS ENUM('♥️', '♣️', '♦️', '♠️')`
        );
        await queryRunner.query(
            `CREATE TABLE "grimoire" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "magicName" character varying NOT NULL, "coverSymbol" "public"."grimoire_coversymbol_enum" NOT NULL DEFAULT '♣️', "magicColor" character varying NOT NULL, CONSTRAINT "PK_adacd671c000d938874ad610c8b" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "date" character varying NOT NULL, "character_id" uuid, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "cash" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cooper" integer NOT NULL, "silver" integer NOT NULL, "eclevtrum" integer NOT NULL, "gold" integer NOT NULL, "platinum" integer NOT NULL, CONSTRAINT "PK_4c783e1bd52fcdfacfb74499a13" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "bank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "bank_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cooper" integer NOT NULL, "silver" integer NOT NULL, "eclevtrum" integer NOT NULL, "gold" integer NOT NULL, "platinum" integer NOT NULL, "bank_id" uuid, CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cash_id" uuid, "bank_account_id" uuid, CONSTRAINT "REL_a05c642fdf22dd3ff3f89dcb5e" UNIQUE ("cash_id"), CONSTRAINT "REL_e327728b452af9ba1cd29de19d" UNIQUE ("bank_account_id"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "uuid" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" integer NOT NULL, "income" integer NOT NULL, "paid" integer NOT NULL, "paymentTime" date NOT NULL, "owner_id" uuid, CONSTRAINT "REL_50aacfe3744a8a35925504fcb5" UNIQUE ("owner_id"), CONSTRAINT "PK_3776334769a96810ce5774e9d1e" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "faction_rank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "salary" integer NOT NULL, CONSTRAINT "PK_b79fa34c30029ac9ad35780bd44" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "gang_zone" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "faction_id" uuid, CONSTRAINT "REL_a2816f8d6dbb4c761d7817dcba" UNIQUE ("faction_id"), CONSTRAINT "PK_99b383d5d831b73753279ea55c5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "faction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "money" integer NOT NULL, "materials" integer NOT NULL, CONSTRAINT "PK_5935637aa4ecd999ac0555ae5a6" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "faction_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "charachter_id" uuid, "faction_id" uuid, "rank_id" uuid, CONSTRAINT "REL_6cc8b2ec024082d725ab16304d" UNIQUE ("charachter_id"), CONSTRAINT "PK_eb26bd93443aab6639421f0e911" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "rank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "salary" integer NOT NULL, CONSTRAINT "PK_a5dfd2e605e5e4fb8578caec083" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "squads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_6ef0717a3dbb0f326bc387dfacb" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "squad_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "faction_id" uuid, "rank_id" uuid, CONSTRAINT "PK_eef2770b0e48d54d4169bb2f6bf" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."character_type_enum" AS ENUM('NPC', 'PC')`
        );
        await queryRunner.query(
            `CREATE TABLE "character" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."character_type_enum" NOT NULL DEFAULT 'PC', "background_id" uuid, "characteristics_id" uuid, "grimoire_id" uuid, "inventory_id" uuid, "character_id" uuid, CONSTRAINT "REL_55d96be2679a079fb92a8c3238" UNIQUE ("background_id"), CONSTRAINT "REL_70fabaf90fc01eea3796b9b3ce" UNIQUE ("characteristics_id"), CONSTRAINT "REL_0d02288a8b2bc07298f21af0a5" UNIQUE ("grimoire_id"), CONSTRAINT "REL_523d22374b8851fe6e1a3c574c" UNIQUE ("inventory_id"), CONSTRAINT "REL_d825247664d496c17308e344fc" UNIQUE ("character_id"), CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "background" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "age" integer NOT NULL, "height" integer NOT NULL, "race_id" uuid, "state_id" uuid, CONSTRAINT "PK_7271b4d2e4bd0f68b3fdb5c090a" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "race" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_a3068b184130d87a20e516045bb" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "devil_spell" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "range" character varying NOT NULL, "duration" character varying NOT NULL, "cost" character varying NOT NULL, "castTime" character varying NOT NULL, "union_id" uuid, CONSTRAINT "PK_6ebb0679e6097c8d92b090c865f" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "devil_union" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_48eb6c40d4d8e7c37f0dd9ecd0d" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "mineral" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_7163ddfaca3b9fc68b150c662cc" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."devils_floor_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7')`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."devils_rank_enum" AS ENUM('1', '2', '3', '4')`
        );
        await queryRunner.query(
            `CREATE TABLE "devils" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "floor" "public"."devils_floor_enum" NOT NULL DEFAULT '1', "rank" "public"."devils_rank_enum" NOT NULL DEFAULT '4', "magic_type" character varying NOT NULL, "union_10_id" uuid, "union_25_id" uuid, "union_50_id" uuid, "union_65_id" uuid, "union_80_id" uuid, "union_100_id" uuid, CONSTRAINT "REL_f4dd7d4cd3fac9dd98838252f2" UNIQUE ("union_10_id"), CONSTRAINT "REL_f4d54e5e887ed6549911da616c" UNIQUE ("union_25_id"), CONSTRAINT "REL_1947e3165abd64b4ff43a57802" UNIQUE ("union_50_id"), CONSTRAINT "REL_1d62a07b8dc0ea4bc82af29487" UNIQUE ("union_65_id"), CONSTRAINT "REL_5d56d673c0247a51bf115f90d1" UNIQUE ("union_80_id"), CONSTRAINT "REL_535e7d20c9fff84a83a8047821" UNIQUE ("union_100_id"), CONSTRAINT "PK_a5fe548e4adfa079304fe67f027" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."skill_skillproficiency_enum" AS ENUM('0', '0.5', '1', '2')`
        );
        await queryRunner.query(
            `CREATE TABLE "skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "skillProficiency" "public"."skill_skillproficiency_enum" NOT NULL DEFAULT '1', "extraBonus" integer NOT NULL, "ability_id" uuid, "proficiency_id" uuid, CONSTRAINT "REL_050ba8921bff2965456d92b2ce" UNIQUE ("ability_id"), CONSTRAINT "REL_0e6b09300470b12bdaa2dc5337" UNIQUE ("proficiency_id"), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "passive_skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "base" integer NOT NULL, "skill_id" uuid, CONSTRAINT "REL_b1ff57d98655574c868bdf823d" UNIQUE ("skill_id"), CONSTRAINT "PK_41d6f2f8d977cefe37fd00bd3da" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "mine" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_200c63ca703bb95d74c475867b0" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "arrest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "time" TIMESTAMP NOT NULL, "reason" character varying NOT NULL, CONSTRAINT "PK_8b8dfe811c16994b221e02b1e0c" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "wanted" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creator" character varying NOT NULL, "suspect" character varying NOT NULL, "priority" integer NOT NULL, "reason" character varying NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_f95ffdcbd385c61a73504a5d4ab" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "house" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "locked" boolean NOT NULL, "paid" integer NOT NULL, CONSTRAINT "PK_8c9220195fd0a289745855fe908" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "clothes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gender" character varying NOT NULL, "category" character varying NOT NULL, "style" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_c73aa6c72fd4b3213bfcdc8739b" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "inventory_weapons_weapons" ("inventoryId" uuid NOT NULL, "weaponsId" uuid NOT NULL, CONSTRAINT "PK_a47c0b5e65c89e9b270cf1750e0" PRIMARY KEY ("inventoryId", "weaponsId"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_bf150ef62744f5e048f75e614a" ON "inventory_weapons_weapons" ("inventoryId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_95507a928aeca7f8aae7ac13cb" ON "inventory_weapons_weapons" ("weaponsId") `
        );
        await queryRunner.query(
            `CREATE TABLE "inventory_armor_armor" ("inventoryId" uuid NOT NULL, "armorId" uuid NOT NULL, CONSTRAINT "PK_a14b87553f69f1e14077d7ee350" PRIMARY KEY ("inventoryId", "armorId"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_3d8018625786991d675bda8a74" ON "inventory_armor_armor" ("inventoryId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_0401018f142adb924c579bde91" ON "inventory_armor_armor" ("armorId") `
        );
        await queryRunner.query(
            `CREATE TABLE "inventory_tool_kits_tool_kit" ("inventoryId" uuid NOT NULL, "toolKitId" uuid NOT NULL, CONSTRAINT "PK_daad208b8ae3b168d3137045a7b" PRIMARY KEY ("inventoryId", "toolKitId"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_cf74b8bb140286122775bae7a0" ON "inventory_tool_kits_tool_kit" ("inventoryId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_86877b035bbc1fedaf45f597d1" ON "inventory_tool_kits_tool_kit" ("toolKitId") `
        );
        await queryRunner.query(
            `CREATE TABLE "inventory_gear_item" ("inventoryId" uuid NOT NULL, "itemId" uuid NOT NULL, CONSTRAINT "PK_101861479912388fe9e507b44ed" PRIMARY KEY ("inventoryId", "itemId"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_5df3814210396d2bca5bef7c70" ON "inventory_gear_item" ("inventoryId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_0c52ae82b1b8317c3cbe35c285" ON "inventory_gear_item" ("itemId") `
        );
        await queryRunner.query(
            `CREATE TABLE "inventory_vehicles_vehicle" ("inventoryId" uuid NOT NULL, "vehicleId" uuid NOT NULL, CONSTRAINT "PK_d89053c7c5cdb7693822947e9c8" PRIMARY KEY ("inventoryId", "vehicleId"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_691eec2b76f3cb80ef3a849fc2" ON "inventory_vehicles_vehicle" ("inventoryId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_e63ec90ead9cc4ee8eda2cbbb4" ON "inventory_vehicles_vehicle" ("vehicleId") `
        );
        await queryRunner.query(
            `CREATE TABLE "character_tasks_task" ("characterId" uuid NOT NULL, "taskId" uuid NOT NULL, CONSTRAINT "PK_36299bbc805308baa0a01c4ffd8" PRIMARY KEY ("characterId", "taskId"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_029006d4e3c259a17dd93ae6df" ON "character_tasks_task" ("characterId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_41b87fa1d0c08452135da5d465" ON "character_tasks_task" ("taskId") `
        );
        await queryRunner.query(
            `ALTER TABLE "item" DROP COLUMN "inventory_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "weapons" DROP COLUMN "inventory_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "toolKit" DROP COLUMN "inventory_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" DROP CONSTRAINT "REL_a05c642fdf22dd3ff3f89dcb5e"`
        );
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "cash_id"`);
        await queryRunner.query(
            `ALTER TABLE "wallet" DROP CONSTRAINT "REL_e327728b452af9ba1cd29de19d"`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" DROP COLUMN "bank_account_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "armor" DROP COLUMN "inventory_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP COLUMN "experience"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP COLUMN "hunger"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP COLUMN "sanity"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP CONSTRAINT "REL_d825247664d496c17308e344fc"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP COLUMN "character_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "note" DROP COLUMN "character_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "REL_f4dd7d4cd3fac9dd98838252f2"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_10_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "REL_f4d54e5e887ed6549911da616c"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_25_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "REL_1947e3165abd64b4ff43a57802"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_50_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "REL_1d62a07b8dc0ea4bc82af29487"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_65_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "REL_5d56d673c0247a51bf115f90d1"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_80_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "REL_535e7d20c9fff84a83a8047821"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_100_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "weapons" ADD "inventory_id" uuid`
        );
        await queryRunner.query(
            `ALTER TABLE "toolKit" ADD "inventory_id" uuid`
        );
        await queryRunner.query(`ALTER TABLE "item" ADD "inventory_id" uuid`);
        await queryRunner.query(`ALTER TABLE "armor" ADD "inventory_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD "experience" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD "hunger" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD "sanity" integer NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE "note" ADD "character_id" uuid`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "cash_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD CONSTRAINT "UQ_a05c642fdf22dd3ff3f89dcb5e3" UNIQUE ("cash_id")`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD "bank_account_id" uuid`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD CONSTRAINT "UQ_e327728b452af9ba1cd29de19d0" UNIQUE ("bank_account_id")`
        );
        await queryRunner.query(
            `ALTER TABLE "character" ADD "character_id" uuid`
        );
        await queryRunner.query(
            `ALTER TABLE "character" ADD CONSTRAINT "UQ_d825247664d496c17308e344fc1" UNIQUE ("character_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_10_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "UQ_f4dd7d4cd3fac9dd98838252f2b" UNIQUE ("union_10_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_25_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "UQ_f4d54e5e887ed6549911da616c5" UNIQUE ("union_25_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_50_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "UQ_1947e3165abd64b4ff43a578027" UNIQUE ("union_50_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_65_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "UQ_1d62a07b8dc0ea4bc82af294877" UNIQUE ("union_65_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_80_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "UQ_5d56d673c0247a51bf115f90d16" UNIQUE ("union_80_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_100_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "UQ_535e7d20c9fff84a83a80478211" UNIQUE ("union_100_id")`
        );
        await queryRunner.query(`ALTER TABLE "weapons" ADD "inventoryId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD "cooper" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD "silver" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD "eclevtrum" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD "gold" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD "platinum" integer NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE "inventory" ADD "walletId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "inventory" ADD CONSTRAINT "UQ_950884209837afcc4d3585352c3" UNIQUE ("walletId")`
        );
        await queryRunner.query(`ALTER TABLE "armor" ADD "inventoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "note" ADD "characterId" uuid`);
        await queryRunner.query(`ALTER TABLE "mineral" ADD "mine_id" uuid`);
        await queryRunner.query(
            `ALTER TYPE "public"."devils_rank_enum" RENAME TO "devils_rank_enum_old"`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."devils_rank_enum" AS ENUM('highest', 'high', 'mid', 'low')`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ALTER COLUMN "rank" DROP DEFAULT`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ALTER COLUMN "rank" TYPE "public"."devils_rank_enum" USING "rank"::"text"::"public"."devils_rank_enum"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ALTER COLUMN "rank" SET DEFAULT 'low'`
        );
        await queryRunner.query(`DROP TYPE "public"."devils_rank_enum_old"`);
        await queryRunner.query(
            `ALTER TABLE "burg" ADD CONSTRAINT "FK_d51177135257fdd6c86a4262104" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "province" ADD CONSTRAINT "FK_51b3ecc6d0fd9eb342ee8742274" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "province" ADD CONSTRAINT "FK_7100060d132705fe129ff576026" FOREIGN KEY ("form_id") REFERENCES "province_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "state" ADD CONSTRAINT "FK_9e79bcb4b9c77c2862cffc0eb10" FOREIGN KEY ("form_id") REFERENCES "stateform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "weapons" ADD CONSTRAINT "FK_9035145a583c9c291c2d5139e58" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "toolKit" ADD CONSTRAINT "FK_ceba9bc9e5905c5fdf963e7d3f6" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "item" ADD CONSTRAINT "FK_2de6ac5903e1d8366ae67caa3c9" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "vehicle" ADD CONSTRAINT "FK_b8433a996a9590e8bc0e330c202" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "armor" ADD CONSTRAINT "FK_7949120bb8d17011162993490a0" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "speed" ADD CONSTRAINT "FK_91b47d4fcf2aa79c2032c8059f8" FOREIGN KEY ("character_characteristics_id") REFERENCES "сharacter_сharacteristics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD CONSTRAINT "FK_3de7660ddbb03266bf3b45f46bb" FOREIGN KEY ("proficiency_id") REFERENCES "proficiency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD CONSTRAINT "FK_a33571e93e431bf7954a7258103" FOREIGN KEY ("strength_id") REFERENCES "ability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD CONSTRAINT "FK_2266566630597e725171d7d1490" FOREIGN KEY ("dexterity_id") REFERENCES "ability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD CONSTRAINT "FK_20cdb54b7dc2dfc3b1608d92729" FOREIGN KEY ("constitution_id") REFERENCES "ability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD CONSTRAINT "FK_bec0cf5cc8f25e02155802a1ff6" FOREIGN KEY ("intelligence_id") REFERENCES "ability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD CONSTRAINT "FK_3ff92766c0608a72fad9bcd4fc2" FOREIGN KEY ("wisdom_id") REFERENCES "ability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD CONSTRAINT "FK_e755b69e23f6f408b4dd3a8c162" FOREIGN KEY ("charisma_id") REFERENCES "ability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD CONSTRAINT "FK_d60a5a2c749df61c88346e60968" FOREIGN KEY ("armor_class_id") REFERENCES "armor_class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "spell" ADD CONSTRAINT "FK_3206fb7f3140a32f0a2a9a379f0" FOREIGN KEY ("grimoireId") REFERENCES "grimoire"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "note" ADD CONSTRAINT "FK_9784437ac65ceb4557307cfdc8a" FOREIGN KEY ("character_id") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "bank_account" ADD CONSTRAINT "FK_24569b6843af6bcef189740e99e" FOREIGN KEY ("bank_id") REFERENCES "bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD CONSTRAINT "FK_a05c642fdf22dd3ff3f89dcb5e3" FOREIGN KEY ("cash_id") REFERENCES "cash"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD CONSTRAINT "FK_e327728b452af9ba1cd29de19d0" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "uuid" ADD CONSTRAINT "FK_50aacfe3744a8a35925504fcb5e" FOREIGN KEY ("owner_id") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "gang_zone" ADD CONSTRAINT "FK_a2816f8d6dbb4c761d7817dcbaa" FOREIGN KEY ("faction_id") REFERENCES "faction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "faction_member" ADD CONSTRAINT "FK_6cc8b2ec024082d725ab16304d8" FOREIGN KEY ("charachter_id") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "faction_member" ADD CONSTRAINT "FK_6069a276a187dfee8f130471a91" FOREIGN KEY ("faction_id") REFERENCES "faction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "faction_member" ADD CONSTRAINT "FK_147103591cb8c40c01b99e67870" FOREIGN KEY ("rank_id") REFERENCES "faction_rank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "squad_member" ADD CONSTRAINT "FK_6ab17889e1630331622fe2964bc" FOREIGN KEY ("faction_id") REFERENCES "squads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "squad_member" ADD CONSTRAINT "FK_2a3e9382f1378ebb25a505fbc9c" FOREIGN KEY ("rank_id") REFERENCES "rank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "character" ADD CONSTRAINT "FK_55d96be2679a079fb92a8c3238b" FOREIGN KEY ("background_id") REFERENCES "background"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "character" ADD CONSTRAINT "FK_70fabaf90fc01eea3796b9b3ce2" FOREIGN KEY ("characteristics_id") REFERENCES "сharacter_сharacteristics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "character" ADD CONSTRAINT "FK_0d02288a8b2bc07298f21af0a5f" FOREIGN KEY ("grimoire_id") REFERENCES "grimoire"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "character" ADD CONSTRAINT "FK_523d22374b8851fe6e1a3c574c5" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "character" ADD CONSTRAINT "FK_d825247664d496c17308e344fc1" FOREIGN KEY ("character_id") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "background" ADD CONSTRAINT "FK_5d6f6589e1b7d72329c7810f39c" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "background" ADD CONSTRAINT "FK_65d9c4a0ed73462a9f923546192" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "devil_spell" ADD CONSTRAINT "FK_dfacd966ea0e15fd762d09bda13" FOREIGN KEY ("union_id") REFERENCES "devil_union"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "FK_f4dd7d4cd3fac9dd98838252f2b" FOREIGN KEY ("union_10_id") REFERENCES "devil_union"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "FK_f4d54e5e887ed6549911da616c5" FOREIGN KEY ("union_25_id") REFERENCES "devil_union"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "FK_1947e3165abd64b4ff43a578027" FOREIGN KEY ("union_50_id") REFERENCES "devil_union"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "FK_1d62a07b8dc0ea4bc82af294877" FOREIGN KEY ("union_65_id") REFERENCES "devil_union"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "FK_5d56d673c0247a51bf115f90d16" FOREIGN KEY ("union_80_id") REFERENCES "devil_union"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "FK_535e7d20c9fff84a83a80478211" FOREIGN KEY ("union_100_id") REFERENCES "devil_union"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "skill" ADD CONSTRAINT "FK_050ba8921bff2965456d92b2ce9" FOREIGN KEY ("ability_id") REFERENCES "ability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "skill" ADD CONSTRAINT "FK_0e6b09300470b12bdaa2dc53372" FOREIGN KEY ("proficiency_id") REFERENCES "proficiency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "passive_skill" ADD CONSTRAINT "FK_b1ff57d98655574c868bdf823d0" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "weapons" ADD CONSTRAINT "FK_a225042c6bd10df68e9692f66b1" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory" ADD CONSTRAINT "FK_950884209837afcc4d3585352c3" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "armor" ADD CONSTRAINT "FK_499f0da763c693a7e50ceaabdbc" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "note" ADD CONSTRAINT "FK_c94f298d9cde38a409be2e734ba" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "mineral" ADD CONSTRAINT "FK_dc4a035b84ed838fe44dde01010" FOREIGN KEY ("mine_id") REFERENCES "mine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_weapons_weapons" ADD CONSTRAINT "FK_bf150ef62744f5e048f75e614ac" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_weapons_weapons" ADD CONSTRAINT "FK_95507a928aeca7f8aae7ac13cbd" FOREIGN KEY ("weaponsId") REFERENCES "weapons"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_armor_armor" ADD CONSTRAINT "FK_3d8018625786991d675bda8a745" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_armor_armor" ADD CONSTRAINT "FK_0401018f142adb924c579bde91b" FOREIGN KEY ("armorId") REFERENCES "armor"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_tool_kits_tool_kit" ADD CONSTRAINT "FK_cf74b8bb140286122775bae7a0c" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_tool_kits_tool_kit" ADD CONSTRAINT "FK_86877b035bbc1fedaf45f597d17" FOREIGN KEY ("toolKitId") REFERENCES "toolKit"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_gear_item" ADD CONSTRAINT "FK_5df3814210396d2bca5bef7c700" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_gear_item" ADD CONSTRAINT "FK_0c52ae82b1b8317c3cbe35c285c" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_vehicles_vehicle" ADD CONSTRAINT "FK_691eec2b76f3cb80ef3a849fc28" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_vehicles_vehicle" ADD CONSTRAINT "FK_e63ec90ead9cc4ee8eda2cbbb47" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "character_tasks_task" ADD CONSTRAINT "FK_029006d4e3c259a17dd93ae6dfb" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "character_tasks_task" ADD CONSTRAINT "FK_41b87fa1d0c08452135da5d4656" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "character_tasks_task" DROP CONSTRAINT "FK_41b87fa1d0c08452135da5d4656"`
        );
        await queryRunner.query(
            `ALTER TABLE "character_tasks_task" DROP CONSTRAINT "FK_029006d4e3c259a17dd93ae6dfb"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_vehicles_vehicle" DROP CONSTRAINT "FK_e63ec90ead9cc4ee8eda2cbbb47"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_vehicles_vehicle" DROP CONSTRAINT "FK_691eec2b76f3cb80ef3a849fc28"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_gear_item" DROP CONSTRAINT "FK_0c52ae82b1b8317c3cbe35c285c"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_gear_item" DROP CONSTRAINT "FK_5df3814210396d2bca5bef7c700"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_tool_kits_tool_kit" DROP CONSTRAINT "FK_86877b035bbc1fedaf45f597d17"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_tool_kits_tool_kit" DROP CONSTRAINT "FK_cf74b8bb140286122775bae7a0c"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_armor_armor" DROP CONSTRAINT "FK_0401018f142adb924c579bde91b"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_armor_armor" DROP CONSTRAINT "FK_3d8018625786991d675bda8a745"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_weapons_weapons" DROP CONSTRAINT "FK_95507a928aeca7f8aae7ac13cbd"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory_weapons_weapons" DROP CONSTRAINT "FK_bf150ef62744f5e048f75e614ac"`
        );
        await queryRunner.query(
            `ALTER TABLE "mineral" DROP CONSTRAINT "FK_dc4a035b84ed838fe44dde01010"`
        );
        await queryRunner.query(
            `ALTER TABLE "note" DROP CONSTRAINT "FK_c94f298d9cde38a409be2e734ba"`
        );
        await queryRunner.query(
            `ALTER TABLE "armor" DROP CONSTRAINT "FK_499f0da763c693a7e50ceaabdbc"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory" DROP CONSTRAINT "FK_950884209837afcc4d3585352c3"`
        );
        await queryRunner.query(
            `ALTER TABLE "weapons" DROP CONSTRAINT "FK_a225042c6bd10df68e9692f66b1"`
        );
        await queryRunner.query(
            `ALTER TABLE "passive_skill" DROP CONSTRAINT "FK_b1ff57d98655574c868bdf823d0"`
        );
        await queryRunner.query(
            `ALTER TABLE "skill" DROP CONSTRAINT "FK_0e6b09300470b12bdaa2dc53372"`
        );
        await queryRunner.query(
            `ALTER TABLE "skill" DROP CONSTRAINT "FK_050ba8921bff2965456d92b2ce9"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "FK_535e7d20c9fff84a83a80478211"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "FK_5d56d673c0247a51bf115f90d16"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "FK_1d62a07b8dc0ea4bc82af294877"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "FK_1947e3165abd64b4ff43a578027"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "FK_f4d54e5e887ed6549911da616c5"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "FK_f4dd7d4cd3fac9dd98838252f2b"`
        );
        await queryRunner.query(
            `ALTER TABLE "devil_spell" DROP CONSTRAINT "FK_dfacd966ea0e15fd762d09bda13"`
        );
        await queryRunner.query(
            `ALTER TABLE "background" DROP CONSTRAINT "FK_65d9c4a0ed73462a9f923546192"`
        );
        await queryRunner.query(
            `ALTER TABLE "background" DROP CONSTRAINT "FK_5d6f6589e1b7d72329c7810f39c"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP CONSTRAINT "FK_d825247664d496c17308e344fc1"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP CONSTRAINT "FK_523d22374b8851fe6e1a3c574c5"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP CONSTRAINT "FK_0d02288a8b2bc07298f21af0a5f"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP CONSTRAINT "FK_70fabaf90fc01eea3796b9b3ce2"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP CONSTRAINT "FK_55d96be2679a079fb92a8c3238b"`
        );
        await queryRunner.query(
            `ALTER TABLE "squad_member" DROP CONSTRAINT "FK_2a3e9382f1378ebb25a505fbc9c"`
        );
        await queryRunner.query(
            `ALTER TABLE "squad_member" DROP CONSTRAINT "FK_6ab17889e1630331622fe2964bc"`
        );
        await queryRunner.query(
            `ALTER TABLE "faction_member" DROP CONSTRAINT "FK_147103591cb8c40c01b99e67870"`
        );
        await queryRunner.query(
            `ALTER TABLE "faction_member" DROP CONSTRAINT "FK_6069a276a187dfee8f130471a91"`
        );
        await queryRunner.query(
            `ALTER TABLE "faction_member" DROP CONSTRAINT "FK_6cc8b2ec024082d725ab16304d8"`
        );
        await queryRunner.query(
            `ALTER TABLE "gang_zone" DROP CONSTRAINT "FK_a2816f8d6dbb4c761d7817dcbaa"`
        );
        await queryRunner.query(
            `ALTER TABLE "uuid" DROP CONSTRAINT "FK_50aacfe3744a8a35925504fcb5e"`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" DROP CONSTRAINT "FK_e327728b452af9ba1cd29de19d0"`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" DROP CONSTRAINT "FK_a05c642fdf22dd3ff3f89dcb5e3"`
        );
        await queryRunner.query(
            `ALTER TABLE "bank_account" DROP CONSTRAINT "FK_24569b6843af6bcef189740e99e"`
        );
        await queryRunner.query(
            `ALTER TABLE "note" DROP CONSTRAINT "FK_9784437ac65ceb4557307cfdc8a"`
        );
        await queryRunner.query(
            `ALTER TABLE "spell" DROP CONSTRAINT "FK_3206fb7f3140a32f0a2a9a379f0"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP CONSTRAINT "FK_d60a5a2c749df61c88346e60968"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP CONSTRAINT "FK_e755b69e23f6f408b4dd3a8c162"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP CONSTRAINT "FK_3ff92766c0608a72fad9bcd4fc2"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP CONSTRAINT "FK_bec0cf5cc8f25e02155802a1ff6"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP CONSTRAINT "FK_20cdb54b7dc2dfc3b1608d92729"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP CONSTRAINT "FK_2266566630597e725171d7d1490"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP CONSTRAINT "FK_a33571e93e431bf7954a7258103"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP CONSTRAINT "FK_3de7660ddbb03266bf3b45f46bb"`
        );
        await queryRunner.query(
            `ALTER TABLE "speed" DROP CONSTRAINT "FK_91b47d4fcf2aa79c2032c8059f8"`
        );
        await queryRunner.query(
            `ALTER TABLE "armor" DROP CONSTRAINT "FK_7949120bb8d17011162993490a0"`
        );
        await queryRunner.query(
            `ALTER TABLE "vehicle" DROP CONSTRAINT "FK_b8433a996a9590e8bc0e330c202"`
        );
        await queryRunner.query(
            `ALTER TABLE "item" DROP CONSTRAINT "FK_2de6ac5903e1d8366ae67caa3c9"`
        );
        await queryRunner.query(
            `ALTER TABLE "toolKit" DROP CONSTRAINT "FK_ceba9bc9e5905c5fdf963e7d3f6"`
        );
        await queryRunner.query(
            `ALTER TABLE "weapons" DROP CONSTRAINT "FK_9035145a583c9c291c2d5139e58"`
        );
        await queryRunner.query(
            `ALTER TABLE "state" DROP CONSTRAINT "FK_9e79bcb4b9c77c2862cffc0eb10"`
        );
        await queryRunner.query(
            `ALTER TABLE "province" DROP CONSTRAINT "FK_7100060d132705fe129ff576026"`
        );
        await queryRunner.query(
            `ALTER TABLE "province" DROP CONSTRAINT "FK_51b3ecc6d0fd9eb342ee8742274"`
        );
        await queryRunner.query(
            `ALTER TABLE "burg" DROP CONSTRAINT "FK_d51177135257fdd6c86a4262104"`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."devils_rank_enum_old" AS ENUM('1', '2', '3', '4')`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ALTER COLUMN "rank" DROP DEFAULT`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ALTER COLUMN "rank" TYPE "public"."devils_rank_enum_old" USING "rank"::"text"::"public"."devils_rank_enum_old"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" ALTER COLUMN "rank" SET DEFAULT '4'`
        );
        await queryRunner.query(`DROP TYPE "public"."devils_rank_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."devils_rank_enum_old" RENAME TO "devils_rank_enum"`
        );
        await queryRunner.query(`ALTER TABLE "mineral" DROP COLUMN "mine_id"`);
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "characterId"`);
        await queryRunner.query(
            `ALTER TABLE "armor" DROP COLUMN "inventoryId"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory" DROP CONSTRAINT "UQ_950884209837afcc4d3585352c3"`
        );
        await queryRunner.query(
            `ALTER TABLE "inventory" DROP COLUMN "walletId"`
        );
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "platinum"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "gold"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "eclevtrum"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "silver"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "cooper"`);
        await queryRunner.query(
            `ALTER TABLE "weapons" DROP COLUMN "inventoryId"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "UQ_535e7d20c9fff84a83a80478211"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_100_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "UQ_5d56d673c0247a51bf115f90d16"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_80_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "UQ_1d62a07b8dc0ea4bc82af294877"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_65_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "UQ_1947e3165abd64b4ff43a578027"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_50_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "UQ_f4d54e5e887ed6549911da616c5"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_25_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP CONSTRAINT "UQ_f4dd7d4cd3fac9dd98838252f2b"`
        );
        await queryRunner.query(
            `ALTER TABLE "devils" DROP COLUMN "union_10_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP CONSTRAINT "UQ_d825247664d496c17308e344fc1"`
        );
        await queryRunner.query(
            `ALTER TABLE "character" DROP COLUMN "character_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" DROP CONSTRAINT "UQ_e327728b452af9ba1cd29de19d0"`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" DROP COLUMN "bank_account_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" DROP CONSTRAINT "UQ_a05c642fdf22dd3ff3f89dcb5e3"`
        );
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "cash_id"`);
        await queryRunner.query(
            `ALTER TABLE "note" DROP COLUMN "character_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP COLUMN "sanity"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP COLUMN "hunger"`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" DROP COLUMN "experience"`
        );
        await queryRunner.query(
            `ALTER TABLE "armor" DROP COLUMN "inventory_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "item" DROP COLUMN "inventory_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "toolKit" DROP COLUMN "inventory_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "weapons" DROP COLUMN "inventory_id"`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_100_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "REL_535e7d20c9fff84a83a8047821" UNIQUE ("union_100_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_80_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "REL_5d56d673c0247a51bf115f90d1" UNIQUE ("union_80_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_65_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "REL_1d62a07b8dc0ea4bc82af29487" UNIQUE ("union_65_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_50_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "REL_1947e3165abd64b4ff43a57802" UNIQUE ("union_50_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_25_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "REL_f4d54e5e887ed6549911da616c" UNIQUE ("union_25_id")`
        );
        await queryRunner.query(`ALTER TABLE "devils" ADD "union_10_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "devils" ADD CONSTRAINT "REL_f4dd7d4cd3fac9dd98838252f2" UNIQUE ("union_10_id")`
        );
        await queryRunner.query(`ALTER TABLE "note" ADD "character_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "character" ADD "character_id" uuid`
        );
        await queryRunner.query(
            `ALTER TABLE "character" ADD CONSTRAINT "REL_d825247664d496c17308e344fc" UNIQUE ("character_id")`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD "sanity" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD "hunger" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "сharacter_сharacteristics" ADD "experience" integer NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE "armor" ADD "inventory_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD "bank_account_id" uuid`
        );
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD CONSTRAINT "REL_e327728b452af9ba1cd29de19d" UNIQUE ("bank_account_id")`
        );
        await queryRunner.query(`ALTER TABLE "wallet" ADD "cash_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "wallet" ADD CONSTRAINT "REL_a05c642fdf22dd3ff3f89dcb5e" UNIQUE ("cash_id")`
        );
        await queryRunner.query(
            `ALTER TABLE "toolKit" ADD "inventory_id" uuid`
        );
        await queryRunner.query(
            `ALTER TABLE "weapons" ADD "inventory_id" uuid`
        );
        await queryRunner.query(`ALTER TABLE "item" ADD "inventory_id" uuid`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_41b87fa1d0c08452135da5d465"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_029006d4e3c259a17dd93ae6df"`
        );
        await queryRunner.query(`DROP TABLE "character_tasks_task"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_e63ec90ead9cc4ee8eda2cbbb4"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_691eec2b76f3cb80ef3a849fc2"`
        );
        await queryRunner.query(`DROP TABLE "inventory_vehicles_vehicle"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_0c52ae82b1b8317c3cbe35c285"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_5df3814210396d2bca5bef7c70"`
        );
        await queryRunner.query(`DROP TABLE "inventory_gear_item"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_86877b035bbc1fedaf45f597d1"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_cf74b8bb140286122775bae7a0"`
        );
        await queryRunner.query(`DROP TABLE "inventory_tool_kits_tool_kit"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_0401018f142adb924c579bde91"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_3d8018625786991d675bda8a74"`
        );
        await queryRunner.query(`DROP TABLE "inventory_armor_armor"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_95507a928aeca7f8aae7ac13cb"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_bf150ef62744f5e048f75e614a"`
        );
        await queryRunner.query(`DROP TABLE "inventory_weapons_weapons"`);
        await queryRunner.query(`DROP TABLE "clothes"`);
        await queryRunner.query(`DROP TABLE "house"`);
        await queryRunner.query(`DROP TABLE "job"`);
        await queryRunner.query(`DROP TABLE "wanted"`);
        await queryRunner.query(`DROP TABLE "arrest"`);
        await queryRunner.query(`DROP TABLE "mine"`);
        await queryRunner.query(`DROP TABLE "passive_skill"`);
        await queryRunner.query(`DROP TABLE "skill"`);
        await queryRunner.query(
            `DROP TYPE "public"."skill_skillproficiency_enum"`
        );
        await queryRunner.query(`DROP TABLE "devils"`);
        await queryRunner.query(`DROP TYPE "public"."devils_rank_enum"`);
        await queryRunner.query(`DROP TYPE "public"."devils_floor_enum"`);
        await queryRunner.query(`DROP TABLE "mineral"`);
        await queryRunner.query(`DROP TABLE "devil_union"`);
        await queryRunner.query(`DROP TABLE "devil_spell"`);
        await queryRunner.query(`DROP TABLE "race"`);
        await queryRunner.query(`DROP TABLE "background"`);
        await queryRunner.query(`DROP TABLE "character"`);
        await queryRunner.query(`DROP TYPE "public"."character_type_enum"`);
        await queryRunner.query(`DROP TABLE "squad_member"`);
        await queryRunner.query(`DROP TABLE "squads"`);
        await queryRunner.query(`DROP TABLE "rank"`);
        await queryRunner.query(`DROP TABLE "faction_member"`);
        await queryRunner.query(`DROP TABLE "faction"`);
        await queryRunner.query(`DROP TABLE "gang_zone"`);
        await queryRunner.query(`DROP TABLE "faction_rank"`);
        await queryRunner.query(`DROP TABLE "uuid"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "bank_account"`);
        await queryRunner.query(`DROP TABLE "bank"`);
        await queryRunner.query(`DROP TABLE "cash"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "grimoire"`);
        await queryRunner.query(
            `DROP TYPE "public"."grimoire_coversymbol_enum"`
        );
        await queryRunner.query(`DROP TABLE "spell"`);
        await queryRunner.query(`DROP TABLE "сharacter_сharacteristics"`);
        await queryRunner.query(`DROP TABLE "proficiency"`);
        await queryRunner.query(`DROP TABLE "speed"`);
        await queryRunner.query(`DROP TABLE "armor_class"`);
        await queryRunner.query(`DROP TABLE "armor"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "toolKit"`);
        await queryRunner.query(`DROP TABLE "weapons"`);
        await queryRunner.query(`DROP TABLE "ability"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TABLE "stateform"`);
        await queryRunner.query(`DROP TABLE "province"`);
        await queryRunner.query(`DROP TABLE "province_form"`);
        await queryRunner.query(`DROP TABLE "burg"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
