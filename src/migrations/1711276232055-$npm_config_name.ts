import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1711276232055 implements MigrationInterface {
    name = ' $npmConfigName1711276232055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "burg" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "province" DROP CONSTRAINT "FK_7100060d132705fe129ff576026"`);
        await queryRunner.query(`ALTER TABLE "province_form" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "burg" DROP CONSTRAINT "FK_d51177135257fdd6c86a4262104"`);
        await queryRunner.query(`ALTER TABLE "province" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "state" DROP CONSTRAINT "FK_45f9e620c908d76d6b03f356bc1"`);
        await queryRunner.query(`ALTER TABLE "stateform" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "province" DROP CONSTRAINT "FK_51b3ecc6d0fd9eb342ee8742274"`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "devils" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "character" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "background" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
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
        await queryRunner.query(`ALTER TABLE "background" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "character" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "devils" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "state" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "province" ADD CONSTRAINT "FK_51b3ecc6d0fd9eb342ee8742274" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stateform" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "state" ADD CONSTRAINT "FK_45f9e620c908d76d6b03f356bc1" FOREIGN KEY ("formId") REFERENCES "stateform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "province" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "burg" ADD CONSTRAINT "FK_d51177135257fdd6c86a4262104" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "province_form" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "province" ADD CONSTRAINT "FK_7100060d132705fe129ff576026" FOREIGN KEY ("form_id") REFERENCES "province_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "burg" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
