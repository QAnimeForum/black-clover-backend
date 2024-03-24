import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1711275605737 implements MigrationInterface {
    name = ' $npmConfigName1711275605737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "burg" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "provinceId" uuid, CONSTRAINT "PK_3f599743b5ef43b82430448c756" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "province_form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_7100060d132705fe129ff576026" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "province" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "short_name" character varying NOT NULL, "full_name" character varying NOT NULL, "state_id" uuid, "form_id" uuid, CONSTRAINT "REL_51b3ecc6d0fd9eb342ee874227" UNIQUE ("state_id"), CONSTRAINT "REL_7100060d132705fe129ff57602" UNIQUE ("form_id"), CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stateform" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_8a14859db916aeda81c38a99b15" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "fullName" character varying NOT NULL, "description" character varying NOT NULL, "formId" uuid, CONSTRAINT "REL_45f9e620c908d76d6b03f356bc" UNIQUE ("formId"), CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spell" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "school" character varying NOT NULL, "castTime" character varying NOT NULL, "range" character varying NOT NULL, "concentration" boolean NOT NULL, "duration" character varying NOT NULL, "material" character varying NOT NULL, "minimumLevel" character varying NOT NULL, "ritual" boolean NOT NULL, "spellAttack" boolean NOT NULL, "spellcastingAbility" character varying NOT NULL, CONSTRAINT "PK_148c7e69812f7047fe34e3848fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "character" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "devils" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "floor" "public"."devils_floor_enum" NOT NULL DEFAULT '1', "rank" "public"."devils_rank_enum" NOT NULL DEFAULT 'low', "magic_type" character varying NOT NULL, CONSTRAINT "PK_a5fe548e4adfa079304fe67f027" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "background" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_7271b4d2e4bd0f68b3fdb5c090a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spell_entity" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "school" character varying NOT NULL, "castTime" character varying NOT NULL, "range" character varying NOT NULL, "concentration" boolean NOT NULL, "duration" character varying NOT NULL, "material" character varying NOT NULL, "minimumLevel" character varying NOT NULL, "ritual" boolean NOT NULL, "spellAttack" boolean NOT NULL, "spellcastingAbility" character varying NOT NULL, CONSTRAINT "PK_fee6fd29b831c043df5e6ef4fb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "burg" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "province_form" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "province" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stateform" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "devils" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "character" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "background" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "burg" ADD CONSTRAINT "FK_d51177135257fdd6c86a4262104" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "province" ADD CONSTRAINT "FK_51b3ecc6d0fd9eb342ee8742274" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "province" ADD CONSTRAINT "FK_7100060d132705fe129ff576026" FOREIGN KEY ("form_id") REFERENCES "province_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "state" ADD CONSTRAINT "FK_45f9e620c908d76d6b03f356bc1" FOREIGN KEY ("formId") REFERENCES "stateform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "state" DROP CONSTRAINT "FK_45f9e620c908d76d6b03f356bc1"`);
        await queryRunner.query(`ALTER TABLE "province" DROP CONSTRAINT "FK_7100060d132705fe129ff576026"`);
        await queryRunner.query(`ALTER TABLE "province" DROP CONSTRAINT "FK_51b3ecc6d0fd9eb342ee8742274"`);
        await queryRunner.query(`ALTER TABLE "burg" DROP CONSTRAINT "FK_d51177135257fdd6c86a4262104"`);
        await queryRunner.query(`ALTER TABLE "background" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "character" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "devils" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "stateform" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "province" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "province_form" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "burg" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`DROP TABLE "spell_entity"`);
        await queryRunner.query(`DROP TABLE "background"`);
        await queryRunner.query(`DROP TABLE "devils"`);
        await queryRunner.query(`DROP TABLE "character"`);
        await queryRunner.query(`DROP TABLE "spell"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TABLE "stateform"`);
        await queryRunner.query(`DROP TABLE "province"`);
        await queryRunner.query(`DROP TABLE "province_form"`);
        await queryRunner.query(`DROP TABLE "burg"`);
    }

}
