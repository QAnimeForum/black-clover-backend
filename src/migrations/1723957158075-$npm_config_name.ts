import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1723957158075 implements MigrationInterface {
    name = ' $npmConfigName1723957158075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "armed_forces" DROP CONSTRAINT "FK_7cba12869189b72b04204c4f741"`);
        await queryRunner.query(`ALTER TABLE "armed_forces_member" ADD "stars" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "armed_forces" ADD CONSTRAINT "FK_648fc9f9310cc2135e052e4c6b1" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "armed_forces" DROP CONSTRAINT "FK_648fc9f9310cc2135e052e4c6b1"`);
        await queryRunner.query(`ALTER TABLE "armed_forces_member" DROP COLUMN "stars"`);
        await queryRunner.query(`ALTER TABLE "armed_forces" ADD CONSTRAINT "FK_7cba12869189b72b04204c4f741" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
