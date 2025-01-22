import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1734884321362 implements MigrationInterface {
    name = 'Default1734884321362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User_Info\` CHANGE \`userContact\` \`userContact\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User_Info\` CHANGE \`userContact\` \`userContact\` varchar(255) NOT NULL`);
    }

}
